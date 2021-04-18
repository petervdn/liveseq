import { useEffect, useState } from 'react';
import { useLiveseqContext } from './useLiveseq';
import { createRange } from '../lib/time/beatsRange/beatsRange';

export const useScheduleData = (start: number, end: number) => {
  const liveseq = useLiveseqContext();
  const getScheduleDataWithinRange = () => {
    // TODO: would be nice to not have to pass the tempo
    return liveseq.getScheduleDataWithinRange(createRange(start, end), liveseq.getTempo());
  };
  const [scheduleData, setScheduleData] = useState(getScheduleDataWithinRange);

  useEffect(() => {
    setScheduleData(getScheduleDataWithinRange());
    // disabled on purpose
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end]);

  return scheduleData;
};
