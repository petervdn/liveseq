import { useScheduleData } from '../../liveseq/react/useScheduleData';
import { ScheduleNotes } from './ScheduleNotes';
import { ScheduleSlots } from './ScheduleSlots';
import { ScheduleScenes } from './ScheduledScenes';
import type { SchedulerInspectorProps } from './SchedulerInspector';

export type SchedulerViewersProps = SchedulerInspectorProps & {
  // eslint-disable-next-line react/no-unused-prop-types
  start: number;
};

export const SchedulerViewers = ({
  end,
  horizontalScale,
  height,
  start,
}: SchedulerViewersProps) => {
  const scheduleData = useScheduleData(start, end);

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
