import type { BeatsRange } from '../../liveseq';
import { Heading } from '../general/Heading';
import type { SlotPlaybackState } from '../../liveseq/lib/scheduler/schedulerState';

type ScheduleSlotsProps = {
  slotPlaybackStateRanges: Array<BeatsRange & SlotPlaybackState>;
  horizontalScale?: number;
  verticalScale?: number;
  height?: number;
};

export const ScheduleSlots = ({
  slotPlaybackStateRanges,
  horizontalScale = 100,
  verticalScale = 18,
  height = 200,
}: ScheduleSlotsProps) => {
  const noteHeight = height / 12;

  const scaleHorizontally = (value: number) => {
    return value * horizontalScale;
  };

  return (
    <>
      <Heading sizeLevel={4}>Active Slots</Heading>

      {/* note output per instrument (instrument channel??) */}
      <div style={{ position: 'relative', height, width: '100%', border: '1px solid black' }}>
        {slotPlaybackStateRanges.flatMap(({ start, end, ...slotPlaybackStanteRange }, index) => {
          return slotPlaybackStanteRange.playingSlots.map((playingSlot, slotIndex) => {
            return (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={`${index}${slotIndex}`}
                style={{
                  position: 'absolute',
                  height: noteHeight,
                  width: `${scaleHorizontally(end - start) - 1}px`,
                  top: index * slotIndex * verticalScale,
                  left: scaleHorizontally(start),
                  background: 'rgba(0,1,0,0.5)',
                }}
              >
                {start} {playingSlot.slotId}
              </div>
            );
          });
        })}
      </div>
    </>
  );
};
