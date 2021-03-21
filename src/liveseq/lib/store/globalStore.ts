import { createStore, Store } from './store';
import { getDefaultProject } from '../project/getDefaultProject';
import type { SerializableProject } from '../project/project';
import type { Bpm } from '../time/time';
import { logDispatch } from './logDispatch';

export type LiveseqState = {
  isPlaying: boolean;
  project: SerializableProject;
  activeSceneIds: Array<string>;
  tempo: Bpm;
};

export type ActionType = 'play' | 'stop' | 'pause' | 'playSlots' | 'stopSlots' | 'activateScenes';

type GlobalStoreInstance = Store<LiveseqState, ActionType>;

// ACTIONS
// actions can be triggered internally or programmatically in real time
// they abstract store dispatch from the rest of the app

const play = (store: GlobalStoreInstance) => () => {
  store.dispatch(
    'play',
    store.setState({
      ...store.getState(),
      isPlaying: true,
    }),
  );
};

const stop = (store: GlobalStoreInstance) => () => {
  store.dispatch(
    'stop',
    store.setState({
      ...store.getState(),
      isPlaying: false,
    }),
  );
};

export type GlobalStore = ReturnType<typeof createGlobalStore>;

export const createGlobalStore = (initialState: Partial<LiveseqState> = {}) => {
  const defaultState: LiveseqState = {
    isPlaying: false,
    project: getDefaultProject(),
    activeSceneIds: [],
    tempo: 120 as Bpm,
  };

  const store = createStore<LiveseqState, ActionType>(defaultState, initialState, logDispatch);

  return {
    actions: {
      play: play(store),
      stop: stop(store),
    },
    subscribe: store.subscribe,
    dispose: store.dispose,
    getState: store.getState,
  };
};
