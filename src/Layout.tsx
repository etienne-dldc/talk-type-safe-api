import React from 'react';
import './index.css';
import { MDXProvider } from '@mdx-js/react';
import { CodeHighlight } from './CodeHighlight';

const H1 = ({ children }: any) => (
  <h1>
    # <span>{children}</span>
  </h1>
);

const H2 = ({ children }: any) => (
  <h2>
    ## <span>{children}</span>
  </h2>
);

const Link = ({ children, href }: any) => (
  <span style={{ color: '#CFD8DC' }}>
    [<span style={{ color: '#1A237E' }}>{children}</span>](
    <a style={{ color: '#1A237E' }} href={href}>
      {href}
    </a>
    )
  </span>
);

const Blockquote = ({ children }: any) => (
  <blockquote>
    <span className="arrows">
      {new Array(20).fill(null).map((_, i) => (
        <React.Fragment key={i}>
          <span>{`>`}</span>
          <br />
        </React.Fragment>
      ))}
    </span>
    {children}
  </blockquote>
);

const ListItem = ({ children }: any) => (
  <li>
    <span className="dash">{`- `}</span>
    {children}
  </li>
);

const Pre = (props: any) => {
  return (
    <CodeHighlight
      code={props.children.props.children}
      language={props.children.props.props.className.replace('language-', '')}
    />
  );
};

const COMPONENTS = {
  h1: H1,
  h2: H2,
  a: Link,
  blockquote: Blockquote,
  li: ListItem,
  pre: Pre
};

const Layout = ({ children }: any) => {
  // inject components
  injectComponents(children);

  return <MDXProvider components={COMPONENTS}>{children}</MDXProvider>;
  // return <div>{children}</div>;
};

export function injectComponents(children: any): void {
  if (!children) {
    return;
  }
  if (typeof children === 'string') {
    return;
  }
  if (Array.isArray(children)) {
    children.forEach(child => injectComponents(child));
    return;
  }
  if (React.isValidElement(children)) {
    if (typeof children.type === 'string') {
      injectComponents((children.props as any).children);
      return;
    }
    if (children.props && (children.props as any).name) {
      (children.props as any).components = COMPONENTS;
      injectComponents((children.props as any).children);
      return;
    }
    return;
  }
  console.log('unhandled', children);
}

export default Layout;
