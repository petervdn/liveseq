import type React from 'react';
import { useScheduleData } from '../../liveseq/react/useScheduleData';
import { ScheduleNotes } from './ScheduleNotes';
import { ScheduleSlots } from './ScheduleSlots';
import { ScheduleScenes } from './ScheduledScenes';
import { CodeViewer } from '../general/CodeViewer';
import { removeNonSerializableProps } from '../utils/removeNonSerializableProps';

export const SchedulerInspector: React.FunctionComponent = () => {
  const scheduleData = useScheduleData(0, 32);

  return (
    <>
      {/* note output per instrument (instrument channel??) */}
      {scheduleData.scheduleItems.map((scheduleItem, index) => {
        // eslint-disable-next-line react/no-array-index-key
        return <ScheduleNotes key={index} scheduleItem={scheduleItem}></ScheduleNotes>;
      })}
      <ScheduleSlots slotPlaybackStateRanges={scheduleData.slotPlaybackStateRanges} />
      <ScheduleScenes slotPlaybackStateRanges={scheduleData.slotPlaybackStateRanges} />

      <CodeViewer name="Schedule Data">{removeNonSerializableProps(scheduleData)}</CodeViewer>
    </>
  );
};
