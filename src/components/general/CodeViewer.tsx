import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/palenight';
import { stringify } from 'javascript-stringify';
import { camelCase } from 'change-case';

export const CodeViewer = (props: { name: string; children: Record<string, unknown> }) => {
  const code = `const ${camelCase(props.name)} = ${stringify(props.children, undefined, 2)}` || '';
  return (
    // <ExtensibleCodeViewer language="javascript" code={} line={(props) => <CodeLine {...props} />} />
    <Highlight {...defaultProps} theme={theme} code={code} language="javascript">
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, index) => (
            // eslint-disable-next-line react/jsx-key
            <div {...getLineProps({ line, key: index })}>
              {line.map((token, key) => (
                // eslint-disable-next-line react/jsx-key
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
