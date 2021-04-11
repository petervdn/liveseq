import { Wrapper } from './Wrapper';
import { Fill } from './Fill';
import { Heading } from './Heading';

export type ItemsViewerProps = {
  title: string;
  height?: number;
  children: React.ReactNode;
};

export const ItemsViewer = ({ title, height, children }: ItemsViewerProps) => {
  return (
    <Wrapper marginTop={15} marginBottom={15} height={height}>
      <Fill color="white" />
      <Fill color="#a666ff" margin={-5} opacity={0.9} />
      <Heading position="absolute" sizeLevel={5}>
        {title}
      </Heading>
      {children}
    </Wrapper>
  );
};
