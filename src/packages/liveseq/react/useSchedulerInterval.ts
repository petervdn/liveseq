import { useEffect, useState } from 'react';
import { useLiveseqContext } from './useLiveseq';
import { usePlayback } from './usePlayback';

const initialBeatsRange = { start: 0, end: 0 };
export const useSchedulerInterval = () => {
  const liveseq = useLiveseqContext();
  const [beatsRange, setBeatsRange] = useState(initialBeatsRange);
  const { playbackState } = usePlayback();

  useEffect(() => {
    playbackState === 'stop' && setBeatsRange(initialBeatsRange);
  }, [playbackState]);

  useEffect(() => {
    return liveseq.onSchedule((data) => {
      setBeatsRange({ start: data.beatsRange.start, end: data.beatsRange.end });
    });
  }, [liveseq]);

  return beatsRange;
};
