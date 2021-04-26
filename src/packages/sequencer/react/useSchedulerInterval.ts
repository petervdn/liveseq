import { useEffect, useState } from 'react';
import { subscribe } from 'callbag-common';
import { useLiveseqContext } from './useLiveseq';
import { usePlayback } from './usePlayback';
import type { ScheduleData } from '../lib/scheduler/scheduler';

const initialBeatsRange = { start: 0, end: 0 };
export const useSchedulerInterval = () => {
  const liveseq = useLiveseqContext();
  const [beatsRange, setBeatsRange] = useState(initialBeatsRange);
  const { playbackState } = usePlayback();

  useEffect(() => {
    playbackState === 'stop' && setBeatsRange(initialBeatsRange);
  }, [playbackState]);

  useEffect(() => {
    return subscribe<ScheduleData>((data) => {
      setBeatsRange({ start: data.beatsRange.start, end: data.beatsRange.end });
    })(liveseq.schedule$);
  }, [liveseq]);

  return beatsRange;
};
