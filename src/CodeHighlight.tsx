/* eslint-disable react/jsx-key */
import React from 'react';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/vsDark';

interface Props {
  language: Language;
  code: string;
  startAtLine?: number;
}

export const CodeHighlight: React.FC<Props> = ({
  code,
  language,
  startAtLine
}) => {
  let codeClean = code.trim();
  if (startAtLine !== undefined) {
    codeClean = codeClean
      .split('\n')
      .slice(startAtLine)
      .join('\n');
  }

  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={codeClean}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={'code-highlight ' + className}
          style={{ ...style, overflowY: 'auto' }}
        >
          <div style={{ padding: '1rem' }}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </div>
        </pre>
      )}
    </Highlight>
  );
};
