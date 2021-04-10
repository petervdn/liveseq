import { useEffect, useState } from 'react';
import { useLiveseqContext } from './useLiveseq';
import type { BeatsRange } from '..';
import { createRange } from '../lib/time/beatsRange';

export const useScheduleData = (start: number, end: number) => {
  const liveseq = useLiveseqContext();
  const [info, setInfo] = useState(
    // TODO: would be nice to not have to pass the tempo
    liveseq.getScheduleDataWithinRange(createRange(start, end), liveseq.getTempo()),
  );

  useEffect(() => {
    return liveseq.onSchedule((data) => {
      return setInfo(
        liveseq.getScheduleDataWithinRange(
          (data.slotPlaybackStateRanges as unknown) as BeatsRange,
          liveseq.getTempo(),
        ),
      );
    });
  }, [liveseq]);

  return info;
};
