import React from 'react';
import {
  parse,
  traverse,
  NodeIs,
  resolve,
  CreateNode,
  createNodeFromValue
} from 'docsy';
import { Slides, SlideItem } from './Slides';
import { StepProps, resolveMaxStepsConfig } from './Step';

type Folder = { [key: string]: string | Folder };

interface Page {
  path: Array<string>;
  url: string;
}

interface PageWithContent {
  path: Array<string>;
  url: string;
  content: string;
}

interface Props {
  files: Folder;
  header?: string;
}

const Deck: React.FC<Props> = ({ header = '', files }) => {
  const pages = React.useMemo(() => {
    const result: Array<Page> = [];
    function handleFolder(folder: Folder, parent: Array<string>) {
      Object.keys(folder)
        .sort()
        .forEach(key => {
          const value = folder[key];
          if (typeof value === 'string') {
            result.push({
              path: [...parent, key],
              url: value
            });
            return;
          }
          handleFolder(value, [...parent, key]);
        });
    }
    handleFolder(files, []);
    return result;
  }, [files]);

  const [pagesContent, setPageContent] = React.useState<Array<
    PageWithContent
  > | null>(null);

  const [refreshToken, setRefreshToken] = React.useState(Math.random());

  React.useEffect(() => {
    let canceled = false;
    setPageContent(null);
    Promise.all(
      pages.map(
        async (p): Promise<PageWithContent> => {
          const res = await fetch(p.url);
          const content = await res.text();
          return {
            ...p,
            content
          };
        }
      )
    ).then(content => {
      if (canceled === false) {
        setPageContent(content);
      }
    });

    return () => {
      canceled = true;
    };
  }, [pages, refreshToken]);

  const refresh = React.useCallback(() => {
    setRefreshToken(Math.random());
  }, []);

  React.useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.code === 'KeyR' && e.ctrlKey) {
        refresh();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, [refresh]);

  const slides = React.useMemo((): Array<SlideItem> | null => {
    if (!pagesContent) {
      return null;
    }
    return pagesContent.map(
      (page): SlideItem => {
        try {
          const parsed = parse(page.content);
          let maxStep = 0;
          let stepCount = 0;
          traverse(parsed, node => {
            if (NodeIs.Element(node)) {
              if (
                NodeIs.Identifier(node.component) &&
                node.component.name === 'Step'
              ) {
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
                maxStep = Math.max(
                  maxStep,
                  resolveMaxStepsConfig(step),
                  stepCount
                );
              }
            }
          });
          return {
            type: 'slide',
            url: page.url,
            path: page.path,
            slug: '/' + page.path.join('/'),
            content: parsed,
            steps: maxStep
          };
        } catch (error) {
          console.error(error);
          return {
            steps: 0,
            url: page.url,
            path: page.path,
            slug: '/' + page.path.join('/'),
            type: 'error',
            error: <div>Error: {String(error)}</div>
          };
        }
      }
    );
  }, [pagesContent]);

  if (!slides) {
    return <div>Loading...</div>;
  }
  return <Slides slides={slides} header={header} />;
};

export default Deck;
