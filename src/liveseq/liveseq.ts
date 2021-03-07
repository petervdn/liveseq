import { createPlayer } from './player';
import { audioContext } from './utils/audioContext';

export type Liveseq = ReturnType<typeof createLiveseq>;

export const createLiveseq = () => {
  const player = createPlayer(audioContext);

  return {
    ...player,
    audioContext,
  };
};
