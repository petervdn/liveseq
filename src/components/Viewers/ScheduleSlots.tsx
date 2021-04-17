import type { BeatsRange } from '../../liveseq';
import type { SlotPlaybackState } from '../../liveseq/lib/scheduler/schedulerState';
import { ItemsViewer } from '../general/ItemsViewer';
import { Item } from '../general/Item';
import { Label } from '../general/Label';

type ScheduleSlotsProps = {
  slotPlaybackStateRanges: Array<BeatsRange & SlotPlaybackState>;
  totalBeats: number;
  horizontalScale: number;
  verticalScale?: number;
  height: number;
};

export const ScheduleSlots = ({
  slotPlaybackStateRanges,
  horizontalScale,
  totalBeats,
  verticalScale = 18,
  height,
}: ScheduleSlotsProps) => {
  const noteHeight = height / 12;

  return (
    <ItemsViewer
      horizontalScale={horizontalScale}
      totalBeats={totalBeats}
      title="Active Slots"
      height={height}
    >
      {slotPlaybackStateRanges.flatMap(({ start, end, ...slotPlaybackStanteRange }, index) => {
        return slotPlaybackStanteRange.playingSlots.map((playingSlot, slotIndex) => {
          return (
            <Item
              // eslint-disable-next-line react/no-array-index-key
              key={`${index}${slotIndex}`}
              height={noteHeight}
              width={end - start}
              bottom={slotIndex}
              verticalScale={verticalScale}
              horizontalScale={horizontalScale}
              left={start}
            >
              <Label>{playingSlot.slotId}</Label>
            </Item>
          );
        });
      })}
    </ItemsViewer>
  );
};
