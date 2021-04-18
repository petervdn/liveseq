import { useState } from 'react';
import { Tabs } from '../general/Tabs';
import type { ViewerVisualProps } from '../general/ItemsViewer';
import { ScheduleData } from './ScheduleData';
import { Scheduler } from './Scheduler';

export type SchedulerInspectorProps = ViewerVisualProps;

export const SchedulerInspector = (props: SchedulerInspectorProps) => {
  const [start, setStart] = useState(0);
  const [end, setTotalBeats] = useState(props.end);

  return (
    <Tabs
      items={[
        {
          label: 'Visualizer',
          component: () => <Scheduler {...props} start={start} end={end} />,
        },
        {
          label: 'Schedule Data',
          component: () => <ScheduleData {...props} start={start} end={end} />,
        },
      ]}
    >
      <input
        type="number"
        value={start}
        min="0"
        max="100"
        onChange={(event) => {
          setStart(parseInt(event.target.value, 10));
        }}
      />
      <input
        type="number"
        value={end}
        min="0"
        max="100"
        onChange={(event) => {
          setTotalBeats(parseInt(event.target.value, 10));
        }}
      />
    </Tabs>
  );
};
