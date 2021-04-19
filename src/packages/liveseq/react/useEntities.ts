import { useEffect, useState } from 'react';
import { useLiveseqContext } from './useLiveseq';

export const useTimelines = () => {
  const liveseq = useLiveseqContext();
  const [timelines, setTimelines] = useState(liveseq.timelines.getList);

  useEffect(() => {
    return liveseq.timelines.subscribe(() => setTimelines(liveseq.timelines.getList()));
  }, [liveseq]);
  return timelines;
};
