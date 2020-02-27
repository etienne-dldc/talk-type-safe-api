import React from 'react';
import { CodeHighlight } from './CodeHighlight';
import { Language } from 'prism-react-renderer';

export const Title: React.FC = ({ children }) => {
  return (
    <h1>
      #{' '}
      <span>
        {React.createElement(React.Fragment, null, ...(children as any))}
      </span>
    </h1>
  );
};

export const SubTitle: React.FC = ({ children }) => (
  <h2>
    ## <span>{children}</span>
  </h2>
);

export const Link: React.FC<{ to: string }> = ({ to, children }) => (
  <span style={{ color: '#CFD8DC' }}>
    [<span style={{ color: '#1A237E' }}>{children}</span>](
    <a style={{ color: '#1A237E' }} href={to}>
      {to}
    </a>
    )
  </span>
);

export const Quote: React.FC = ({ children }) => (
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

export const List: React.FC = ({ children }) => <ul>{children}</ul>;

export const ListItem: React.FC = ({ children }) => (
  <li>
    <span className="dash">{`- `}</span>
    {children}
  </li>
);

export const Image: React.FC<{ src: string }> = ({ src }) => {
  return (
    <div className="img-wrapper">
      <img src={src} />
    </div>
  );
};

export const Code: React.FC<{
  code: string;
  language: Language;
}> = ({ code, language = 'javascript' }) => {
  return <CodeHighlight code={code} language={language} />;
};
