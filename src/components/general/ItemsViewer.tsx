import { Wrapper } from './Wrapper';
import { Fill } from './Fill';
import { Heading } from './Heading';
import { Box } from './Box';
import { times } from '../../liveseq/lib/utils/times';
import { Label } from './Label';

export type ViewerVisualProps = {
  end: number;
  horizontalScale: number;
  // verticalScale?: number;
  height: number;
};

export type ItemsViewerProps = {
  title: string;
  children: React.ReactNode;
} & ViewerVisualProps;

export const ItemsViewer = ({
  title,
  horizontalScale,
  end,
  height,
  children,
}: ItemsViewerProps) => {
  return (
    <Wrapper padding={10} marginTop={20} marginBottom={15} height={height}>
      <Fill color="#292d3d" />
      {times(end + 1, (index) => {
        return (
          <Box
            position="absolute"
            top={-10}
            left={horizontalScale * index}
            height={height + 10}
            width="1px"
            backgroundColor="grey"
            opacity={index % 4 === 0 ? 1 : 0.5}
          >
            <Label marginLeft="-2px">{index.toString()}</Label>
          </Box>
        );
      })}

      <Heading position="absolute" sizeLevel={5}>
        {title}
      </Heading>

      {children}
    </Wrapper>
  );
};
