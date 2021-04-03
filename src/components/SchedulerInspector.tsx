import type React from 'react';
import { useScheduleInfo } from '../liveseq/react/useScheduleInfo';

export const SchedulerInspector: React.FunctionComponent = () => {
  const info = useScheduleInfo();

  return (
    <>
      <h3>Scheduler Info</h3>
      <pre>{JSON.stringify(info, undefined, 2)}</pre>
    </>
  );
};
