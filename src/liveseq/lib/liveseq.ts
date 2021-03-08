import { createGlobalStore, LiveseqState } from './store/globalStore';
import { getAudioContext } from './utils/getAudioContext';
import { createConnectedPlayer } from './player/connectedPlayer';

export type LiveseqProps = {
  initialState?: Partial<LiveseqState>;
  audioContext?: AudioContext;
  lookAheadTime?: number;
  scheduleInterval?: number;
};

export type Liveseq = ReturnType<typeof createLiveseq>;

// Entry point of the library
// Manages:
//   - store initialization
//   - player initialization
//   - sample loading // TODO

export const createLiveseq = ({
  initialState,
  lookAheadTime,
  audioContext = getAudioContext(),
  scheduleInterval,
}: LiveseqProps = {}) => {
  const store = createGlobalStore(initialState);

  const player = createConnectedPlayer({
    audioContext,
    store,
    lookAheadTime,
    scheduleInterval,
  });

  const dispose = () => {
    player.dispose();
    store.dispose();
  };

  // liveseq's API
  return {
    subscribe: store.subscribe,
    ...store.actions,
    dispose,
    audioContext,
  };
};
