import { CodeViewer as ExtensibleCodeViewer, CodeLine } from 'react-extensible-code-viewer';
import 'react-extensible-code-viewer/dist/index.css';
import { stringify } from 'javascript-stringify';
import { camelCase } from 'change-case';
import { Heading } from './Heading';

export const CodeViewer = (props: { name: string; children: Record<string, unknown> }) => {
  return (
    <div>
      <Heading sizeLevel={4}>{props.name}</Heading>
      <ExtensibleCodeViewer
        language="javascript"
        code={`const ${camelCase(props.name)} = ${stringify(props.children, undefined, 2)}` || ''}
        line={(props) => <CodeLine {...props} />}
      ></ExtensibleCodeViewer>
    </div>
  );
};
