import { getDefaultProject } from '../project/getDefaultProject';
import type { SerializableProject } from '../project/project';
import type { Bpm } from '../time/time';
import type { LiveseqPubSub } from '../utils/pubSub';

export type LiveseqState = {
  isPlaying: boolean;
  project: SerializableProject;
  activeSceneIds: Array<string>;
  tempo: Bpm;
};

export type ActionType = 'play' | 'stop' | 'pause' | 'playSlots' | 'stopSlots' | 'activateScenes';

export type Store = ReturnType<typeof createStore>;

export const createStore = (initialState: Partial<LiveseqState> = {}, pubSub: LiveseqPubSub) => {
  const defaultState: LiveseqState = {
    isPlaying: false,
    project: getDefaultProject(),
    activeSceneIds: [],
    tempo: 120 as Bpm,
  };

  let state = {
    ...defaultState,
    ...initialState,
  };

  const setState = (newState: Partial<LiveseqState>) => {
    // mutation!
    state = {
      ...state,
      ...newState,
    };
    return state;
  };

  const getState = () => {
    return state;
  };

  const dispose = () => {
    // nothing to do here yet
  };

  // ACTIONS
  const play = () => {
    pubSub.dispatch(
      'isPlaying',
      setState({
        isPlaying: true,
      }),
    );
  };

  const stop = () => {
    pubSub.dispatch(
      'isPlaying',
      setState({
        isPlaying: false,
      }),
    );
  };

  return {
    actions: {
      play,
      stop,
    },
    dispose,
    getState,
  };
};
