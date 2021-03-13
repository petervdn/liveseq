import { createStore, Store } from './store';
import { getDefaultProject } from '../project/getDefaultProject';
import type { Project } from '../entities/project/project';

export type LiveseqState = {
  isPlaying: boolean;
  project: Project;
  activeSceneIds: Array<string>;
  tempo: number;
};

// TODO: define union for all action types
// todo: how does global action relate to ActionType (are these type props even actiontypes?)
export type GlobalAction =
  | {
      type: 'playSlots';
      // optional, if not present means all
      slotIds?: Array<string>;
    }
  | {
      type: 'stopSlots';
      // optional, if not present means all
      slotIds?: Array<string>;
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

  const store = createStore<LiveseqState, ActionType>(defaultState, initialState);

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
