import { useScheduleData } from '../../packages/liveseq/react/useScheduleData';
import { CodeViewer } from '../general/CodeViewer';
import { removeNonSerializableProps } from '../utils/removeNonSerializableProps';
import type { SchedulerViewersProps } from './SchedulerViewers';

export const ScheduleData = ({ start, end }: SchedulerViewersProps) => {
  const scheduleData = useScheduleData(start, end);

  return <CodeViewer name="Schedule Data">{removeNonSerializableProps(scheduleData)}</CodeViewer>;
};
