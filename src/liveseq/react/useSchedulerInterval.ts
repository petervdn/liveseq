import { useEffect, useState } from 'react';
import { useLiveseqContext } from './useLiveseq';

export const useSchedulerInterval = () => {
  const liveseq = useLiveseqContext();
  const [beatsRange, setBeatsRange] = useState({ start: 0, end: 0 });

  useEffect(() => {
    return liveseq.onSchedule((data) => {
      setBeatsRange({ start: data.beatsRange.start, end: data.beatsRange.end });
    });
  }, [liveseq]);

  return beatsRange;
};
