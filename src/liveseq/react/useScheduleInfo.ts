import { useEffect, useState } from 'react';
import { useLiveseqContext } from './useLiveseq';
import type { BeatsRange } from '..';

export const useScheduleInfo = (start: number, end: number) => {
  const liveseq = useLiveseqContext();
  const [info, setInfo] = useState(liveseq.getScheduleItemsInfo({ start, end } as BeatsRange));

  useEffect(() => {
    return liveseq.onSchedule((data) =>
      // TODO: fix
      setInfo(liveseq.getScheduleItemsInfo((data.nextSlotPlaybackState as unknown) as BeatsRange)),
    );
  }, [liveseq]);

  return info;
};
