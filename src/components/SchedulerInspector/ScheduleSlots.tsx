import type { BeatsRange } from '../../liveseq';
import type { SlotPlaybackState } from '../../liveseq/lib/scheduler/schedulerState';
import { ItemsViewer } from '../general/ItemsViewer';
import { Item } from '../general/Item';
import { Heading } from '../general/Heading';

type ScheduleSlotsProps = {
  slotPlaybackStateRanges: Array<BeatsRange & SlotPlaybackState>;
  horizontalScale: number;
  verticalScale?: number;
  height?: number;
};

export const ScheduleSlots = ({
  slotPlaybackStateRanges,
  horizontalScale,
  verticalScale = 18,
  height = 200,
}: ScheduleSlotsProps) => {
  const noteHeight = height / 12;

  return (
    <ItemsViewer title="Active Slots" height={height}>
      {slotPlaybackStateRanges.flatMap(({ start, end, ...slotPlaybackStanteRange }, index) => {
        return slotPlaybackStanteRange.playingSlots.map((playingSlot, slotIndex) => {
          return (
            <Item
              // eslint-disable-next-line react/no-array-index-key
              key={`${index}${slotIndex}`}
              height={noteHeight}
              width={end - start}
              bottom={index * slotIndex}
              verticalScale={verticalScale}
              horizontalScale={horizontalScale}
              left={start}
            >
              <Heading sizeLevel={5}>{`${start} ${playingSlot.slotId}`}</Heading>
            </Item>
          );
        });
      })}
    </ItemsViewer>
  );
};
