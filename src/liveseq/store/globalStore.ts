// ACTIONS
// actions can be triggered internally by the Player or programatically in real time
// they abstract store dispatch from the rest of the app

import { defaultProject, Project } from '../project/projectStructure';
import { createStore, Store } from '../utils/store';

export type LiveseqState = {
  isPlaying: boolean;
  project: Project;
  activeSceneIds: Array<string>;
  tempo: number;
};

export enum ActionType {
  Play = 'Play',
  Stop = 'Stop',
  Pause = 'Pause',
  PlaySlots = 'PlaySlots',
  StopSlots = 'StopSlots',
  ActivateScenes = 'ActivateScenes',
}

type GlobalStoreInstance = Store<LiveseqState, ActionType>;

// TODO: rename to State
const play = (store: GlobalStoreInstance) => () => {
  store.dispatch(
    ActionType.Play,
    store.setState({
      ...store.getState(),
      isPlaying: true,
    }),
  );
};

const stop = (store: GlobalStoreInstance) => () => {
  store.dispatch(
    ActionType.Stop,
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
    project: defaultProject,
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
  };
};
