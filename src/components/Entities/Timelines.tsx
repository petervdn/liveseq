import { useTimelines } from '../../liveseq/react/useEntities';
import { ItemsViewer, ViewerVisualProps } from '../general/ItemsViewer';
import { Item } from '../general/Item';
import { Label } from '../general/Label';
import { getTimelineDuration } from '../../liveseq/lib/entities/utils/getTimelineDuration';

// TODO: clamp with end
export const Timelines = ({ height = 200, horizontalScale }: ViewerVisualProps) => {
  const timelines = useTimelines();
  return (
    <>
      {timelines.map((timeline, index) => {
        return (
          <ItemsViewer
            key={timeline.id}
            horizontalScale={horizontalScale}
            end={getTimelineDuration(timeline)}
            title={timeline.name!}
            height={height}
          >
            {timeline.clipRanges.map((clipRange, slotIndex) => {
              return (
                <Item
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${index}${slotIndex}`}
                  height={height - 40}
                  width={clipRange.end - clipRange.start}
                  bottom={index * slotIndex}
                  verticalScale={1}
                  horizontalScale={horizontalScale}
                  left={clipRange.start}
                >
                  <Label>{clipRange.noteClipId}</Label>
                </Item>
              );
            })}
          </ItemsViewer>
        );
      })}
    </>
  );
};
