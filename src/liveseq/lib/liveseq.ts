import { createGlobalStore, LiveseqState } from './store/globalStore';
import { getAudioContext } from './utils/getAudioContext';
import { createConnectedPlayer } from './player/connectedPlayer';

export type LiveseqProps = {
  initialState?: Partial<LiveseqState>;
  audioContext?: AudioContext;
};

export type Liveseq = ReturnType<typeof createLiveseq>;

// Entry point of the library
// Manages:
//   - store initialization
//   - player initialization
//   - sample loading // TODO

export const createLiveseq = (props: LiveseqProps = {}) => {
  const store = createGlobalStore(props.initialState);

  const audioContext = props.audioContext || getAudioContext();
  const player = createConnectedPlayer({ audioContext, store });

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
