import { useEffect, useState } from 'react';
import { useLiveseqContext } from './useLiveseq';
// TODO: needs to be exported from index if we plan to use it
import type { TimeRange } from '../lib/time/timeRange';

export const useScheduleInfo = () => {
  const liveseq = useLiveseqContext();
  const [info, setInfo] = useState(
    liveseq.getScheduleItemsInfo({ start: 0, end: 10 } as TimeRange),
  );

  useEffect(() => {
    return liveseq.subscribe.schedule((data) =>
      // TODO: fix
      setInfo(liveseq.getScheduleItemsInfo((data.nextSlotPlaybackState as unknown) as TimeRange)),
    );
  }, [liveseq]);

  return info;
};
