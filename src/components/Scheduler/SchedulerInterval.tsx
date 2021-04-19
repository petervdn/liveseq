import { Box } from '../general/Box';
import { useSchedulerInterval } from '../../packages/liveseq/react/useSchedulerInterval';

export type SchedulerIntervalProps = {
  start: number;
  end: number;
  horizontalScale: number;
};
export const SchedulerInterval = ({ start, end, horizontalScale }: SchedulerIntervalProps) => {
  const beatsRange = useSchedulerInterval();
  return (
    <>
      <Box
        position="absolute"
        marginTop="13px"
        left={start * horizontalScale}
        width={(end - start) * horizontalScale}
        height="4px"
        backgroundColor="blue"
      />
      <Box
        position="absolute"
        marginTop="10px"
        left={beatsRange.start * horizontalScale}
        width={(beatsRange.end - beatsRange.start) * horizontalScale}
        height="10px"
        backgroundColor="yellow"
      />
    </>
  );
};
