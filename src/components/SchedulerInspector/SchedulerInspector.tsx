import type React from 'react';
import { useScheduleData } from '../../liveseq/react/useScheduleData';
import { ScheduleNotes } from './ScheduleNotes';
import { ScheduleSlots } from './ScheduleSlots';

export const SchedulerInspector: React.FunctionComponent = () => {
  const scheduleData = useScheduleData(0, 8);

  // TODO: render queue and slots
  return (
    <>
      <h3>Scheduler Info</h3>

      <ScheduleSlots slotPlaybackStateRanges={scheduleData.slotPlaybackStateRanges}></ScheduleSlots>

      {/* note output per instrument (instrument channel??) */}
      {scheduleData.scheduleItems.map((scheduleItem, index) => {
        // eslint-disable-next-line react/no-array-index-key
        return <ScheduleNotes key={index} scheduleItem={scheduleItem}></ScheduleNotes>;
      })}

      <pre>{JSON.stringify(scheduleData, undefined, 2)}</pre>
    </>
  );
};
