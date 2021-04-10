import type React from 'react';
import { useScheduleData } from '../../liveseq/react/useScheduleData';
import { ScheduleNotes } from './ScheduleNotes';
import { ScheduleSlots } from './ScheduleSlots';
import { ScheduleScenes } from './ScheduledScenes';
import { JsonViewer } from '../general/JsonViewer';

export const SchedulerInspector: React.FunctionComponent = () => {
  const scheduleData = useScheduleData(0, 32);

  return (
    <>
      <h3>Scheduler Info</h3>
      <ScheduleSlots slotPlaybackStateRanges={scheduleData.slotPlaybackStateRanges}></ScheduleSlots>
      <ScheduleScenes
        slotPlaybackStateRanges={scheduleData.slotPlaybackStateRanges}
      ></ScheduleScenes>
      {/* note output per instrument (instrument channel??) */}
      {scheduleData.scheduleItems.map((scheduleItem, index) => {
        // eslint-disable-next-line react/no-array-index-key
        return <ScheduleNotes key={index} scheduleItem={scheduleItem}></ScheduleNotes>;
      })}
      <JsonViewer name="Schedule Data">{scheduleData}</JsonViewer>
    </>
  );
};
