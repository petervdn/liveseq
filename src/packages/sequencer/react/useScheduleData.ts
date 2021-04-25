import { useEffect, useState } from 'react';
import { useLiveseqContext } from './useLiveseq';
import { createRange } from '../../time/beatsRange/beatsRange';
import { useTempo } from './useTempo';

export const useScheduleData = (start: number, end: number) => {
  const liveseq = useLiveseqContext();
  const [tempo] = useTempo();
  const getScheduleDataWithinRange = () => {
    // TODO: would be nice to not have to pass the tempo (and now with streams should be easy)
    return liveseq.getScheduleDataWithinRange(createRange(start, end), tempo);
  };
  const [scheduleData, setScheduleData] = useState(getScheduleDataWithinRange);

  useEffect(() => {
    setScheduleData(getScheduleDataWithinRange());
    // disabled on purpose
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end, tempo]);

  return scheduleData;
};
