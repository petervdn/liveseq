import { useEffect, useState } from 'react';
import { useLiveseqContext } from './useLiveseq';
import type { BeatsRange } from '..';
import { createRange } from '../lib/time/beatsRange';

export const useScheduleInfo = (start: number, end: number) => {
  const liveseq = useLiveseqContext();
  const [info, setInfo] = useState(liveseq.getScheduleItemsInfo(createRange(start, end)));

  useEffect(() => {
    return liveseq.onSchedule((data) => {
      // TODO: fix
      return setInfo(
        liveseq.getScheduleItemsInfo((data.nextSlotPlaybackState as unknown) as BeatsRange),
      );
    });
  }, [liveseq]);

  return info;
};
