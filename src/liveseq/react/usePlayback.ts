import { useEffect, useState } from 'react';
import { useLiveseqContext } from './useLiveseq';

export const usePlayback = () => {
  const liveseq = useLiveseqContext();
  const [playbackState, setPlaybackState] = useState(liveseq.getPlaybackState);

  useEffect(() => {
    return liveseq.onPlaybackChange(setPlaybackState);
  }, [liveseq]);

  return {
    playbackState,
    play: liveseq.play,
    pause: liveseq.pause,
    stop: liveseq.stop,
  };
};
