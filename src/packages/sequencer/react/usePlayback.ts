import { useLiveseqContext } from './useLiveseq';
import { useCallbag } from './useCallbag';

export const usePlayback = () => {
  const liveseq = useLiveseqContext();
  const playbackState = useCallbag(liveseq.playback$);
  // TODO: coming undefined sometimes
  // console.log(playbackState);
  return {
    playbackState,
    play: liveseq.play,
    pause: liveseq.pause,
    stop: liveseq.stop,
  };
};
