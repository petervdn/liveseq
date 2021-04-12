import { Wrapper } from './Wrapper';
import { Fill } from './Fill';
import { Heading } from './Heading';
import { Box } from './Box';
import { Text } from './Text';
import { times } from '../../liveseq/lib/utils/times';

export type ItemsViewerProps = {
  title: string;
  totalBeats: number;
  horizontalScale: number;
  height: number;
  children: React.ReactNode;
};

export const ItemsViewer = ({
  title,
  horizontalScale,
  totalBeats,
  height,
  children,
}: ItemsViewerProps) => {
  return (
    <Wrapper padding={10} marginTop={20} marginBottom={15} height={height}>
      <Fill color="#292d3d" />
      {times(totalBeats, (index) => {
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
            <Text marginLeft="-2px" fontSize={12}>
              {index.toString()}
            </Text>
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
