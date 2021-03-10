import type { Project } from '../project/projectStructure';
import { createStore, Store } from '../utils/store';
import { getDefaultProject } from '../project/getDefaultProject';

export type LiveseqState = {
  isPlaying: boolean;
  project: Project;
  activeSceneIds: Array<string>;
  tempo: number;
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
    tempo: 120,
  };

  const store = createStore(defaultState, initialState);

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
