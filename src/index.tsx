/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  parse,
  traverse,
  NodeIs,
  resolve,
  CreateNode,
  createNodeFromValue,
  ResolveValues
} from 'docsy';
import { Step, StepProps, resolveMaxStepsConfig } from './Step';
import { CodeHighlight } from './CodeHighlight';
import { Slides, SlideItem } from './Slides';
import * as COMPONENTS from './DocsyComponents';
import FILES from '../slides/**/*.dy';

const SNIPPETS_FILES = [
  'tumau/01_demo.ts',
  'tumau/02_koa.js',
  'tumau/03_context_mutable.ts',
  'tumau/04_context_custom.ts',
  'tumau/05_transform.ts',
  'tumau/06_compose.ts',
  'tumau/07_compose_many.ts',
  'tumau/08_tumau_context.ts'
  // 'chemin/01_base.ts',
  // 'chemin/02_match.ts',
  // 'chemin/03_typed.ts',
  // 'chemin/04_how1.ts',
  // 'chemin/05_how2.ts',
  // 'chemin/06_how3.ts',
  // 'chemin/07_how4.ts',
  // 'chemin/08_how5.ts',
  // 'chemin/09_how6.ts',
  // 'chemin/10_compose.ts'
].reduce<{ [key: string]: string }>((acc, file) => {
  acc[
    file
      .replace('/', '_')
      .replace('.ts', '')
      .replace('.js', '')
  ] = `/snippets/${file}`;
  return acc;
}, {});

type Folder = { [key: string]: string | Folder };

interface PageWithContent {
  path: Array<string>;
  url: string;
  content: string;
}

interface Page {
  path: Array<string>;
  url: string;
}

main();

async function main() {
  const PAGES: Array<Page> = [];
  function handleFolder(folder: Folder, parent: Array<string>) {
    Object.keys(folder)
      .sort()
      .forEach(key => {
        const value = folder[key];
        if (typeof value === 'string') {
          PAGES.push({
            path: [...parent, key],
            url: value
          });
          return;
        }
        handleFolder(value, [...parent, key]);
      });
  }
  handleFolder(FILES, []);

  const SNIPPETS = Object.fromEntries(
    await Promise.all(
      Object.entries(SNIPPETS_FILES).map(async ([key, path]) => {
        const res = await fetch(path);
        const content = await res.text();
        return [key, content];
      })
    )
  );

  const RESOLVE_VALUES: ResolveValues = {
    createElement: React.createElement,
    Step: Step,
    Snippets: SNIPPETS,
    Code: CodeHighlight,
    ...COMPONENTS
  };

  const SLIDES = (
    await Promise.all(
      PAGES.map(
        async (p): Promise<PageWithContent> => {
          const res = await fetch(p.url);
          const content = await res.text();

          return {
            ...p,
            content
          };
        }
      )
    )
  ).map(
    (page): SlideItem => {
      try {
        const parsed = parse(page.content);
        let maxStep = 0;
        let stepCount = 0;
        traverse(parsed, node => {
          if (NodeIs.Element(node)) {
            if (NodeIs.Identifier(node.component) && node.component.name === 'Step') {
              stepCount += 1;
              const props: StepProps = resolve(node.props, {
                createElement: () => {}
              });
              const step = props.step || maxStep + 1;
              if (props.step === undefined) {
                node.props.items.push(
                  CreateNode.Prop({
                    name: CreateNode.Identifier({ name: 'step' }),
                    value: createNodeFromValue(step)
                  })
                );
              }
              maxStep = Math.max(maxStep, resolveMaxStepsConfig(step), stepCount);
            }
          }
        });
        return {
          url: page.url,
          path: page.path,
          slug: '/' + page.path.join('/'),
          content: resolve(parsed, RESOLVE_VALUES),
          steps: maxStep
        };
      } catch (error) {
        console.error(error);
        return {
          steps: 0,
          url: page.url,
          path: page.path,
          slug: '/' + page.path.join('/'),
          content: [<div key="error">Error: {String(error)}</div>]
        };
      }
    }
  );

  ReactDOM.render(
    <Slides slides={SLIDES} header="etienne-dldc/talk-type-safe-api" />,
    document.getElementById('root')
  );
}
