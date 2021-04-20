import { merge } from 'callbag-common';
import { staticSignal } from './callbag/staticSignal';

export const createPlaybackSource = () => {
  const [playSource, play] = staticSignal('playing');
  const [stopSource, stop] = staticSignal('stopped');
  const [pauseSource, pause] = staticSignal('paused');
  const source = merge(playSource, stopSource, pauseSource);

  return {
    source,
    play,
    stop,
    pause,
  };
};
