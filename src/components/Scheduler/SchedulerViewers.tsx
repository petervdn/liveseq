import { useScheduleData } from '../../liveseq/react/useScheduleData';
import { ScheduleNotes } from './ScheduleNotes';
import { ScheduleSlots } from './ScheduleSlots';
import { ScheduleScenes } from './ScheduledScenes';
import type { SchedulerInspectorProps } from './SchedulerInspector';
import { useSchedulerInterval } from '../../liveseq/react/useSchedulerInterval';

export type SchedulerViewersProps = SchedulerInspectorProps & {
  // eslint-disable-next-line react/no-unused-prop-types
  start: number;
};

const onlyInRange = true;

export const SchedulerViewers = ({
  end,
  horizontalScale,
  height,
  start,
}: SchedulerViewersProps) => {
  const beatsRange = useSchedulerInterval();
  const interval = onlyInRange ? [beatsRange.start, beatsRange.end] : [start, end];
  const scheduleData = useScheduleData(interval[0], interval[1]);

  return (
    <>
      {/* note output per instrument (instrument channel??) */}
      {scheduleData.scheduleItems.map((scheduleItem, index) => {
        return (
          <ScheduleNotes
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            end={end}
            horizontalScale={horizontalScale}
            scheduleItem={scheduleItem}
            height={height}
          />
        );
      })}
      <ScheduleSlots
        end={end}
        horizontalScale={horizontalScale}
        height={height}
        slotPlaybackStateRanges={scheduleData.slotPlaybackStateRanges}
      />
      <ScheduleScenes
        end={end}
        horizontalScale={horizontalScale}
        height={height}
        slotPlaybackStateRanges={scheduleData.slotPlaybackStateRanges}
      />
    </>
  );
};
