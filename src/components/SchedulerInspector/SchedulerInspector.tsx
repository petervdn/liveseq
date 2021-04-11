import { useScheduleData } from '../../liveseq/react/useScheduleData';
import { ScheduleNotes } from './ScheduleNotes';
import { ScheduleSlots } from './ScheduleSlots';
import { ScheduleScenes } from './ScheduledScenes';
import { CodeViewer } from '../general/CodeViewer';
import { removeNonSerializableProps } from '../utils/removeNonSerializableProps';

const horizontalScale = 60;

export const SchedulerInspector = () => {
  const scheduleData = useScheduleData(0, 32);

  return (
    <>
      {/* note output per instrument (instrument channel??) */}
      {scheduleData.scheduleItems.map((scheduleItem, index) => {
        return (
          <ScheduleNotes
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            horizontalScale={horizontalScale}
            scheduleItem={scheduleItem}
          />
        );
      })}
      <ScheduleSlots
        horizontalScale={horizontalScale}
        slotPlaybackStateRanges={scheduleData.slotPlaybackStateRanges}
      />
      <ScheduleScenes
        horizontalScale={horizontalScale}
        slotPlaybackStateRanges={scheduleData.slotPlaybackStateRanges}
      />

      <CodeViewer name="Schedule Data">{removeNonSerializableProps(scheduleData)}</CodeViewer>
    </>
  );
};
