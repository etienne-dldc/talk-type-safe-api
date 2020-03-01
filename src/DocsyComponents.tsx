import React from 'react';
import { NavContex } from './NavContext';

export const Title: React.FC = ({ children }) => {
  return (
    <h1>
      # <span>{React.createElement(React.Fragment, null, ...(children as any))}</span>
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

export const P: React.FC = ({ children }) => <p>{children}</p>;

export const PageLink: React.FC<{ to: string }> = ({ to, children }) => {
  const nav = React.useContext(NavContex);

  return (
    <span style={{ color: '#CFD8DC' }}>
      <a
        style={{ color: '#1A237E' }}
        href={to}
        onClick={e => {
          e.preventDefault();
          nav.push(to);
        }}
      >
        {children}
      </a>
    </span>
  );
};

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

export const Li: React.FC = ({ children }) => (
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

export const InlineCode: React.FC = ({ children }) => {
  return <code>{children}</code>;
};
