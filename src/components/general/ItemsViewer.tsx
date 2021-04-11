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
    <Wrapper padding={10} marginTop={15} marginBottom={15} height={height}>
      <Fill color="#292d3d" />
      <Heading position="absolute" sizeLevel={5}>
        {title}
      </Heading>
      {children}
    </Wrapper>
  );
};
