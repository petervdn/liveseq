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

  const dispose = () => {
    // nothing to do here yet
  };

  // ACTIONS
  const play = () => {
    pubSub.dispatch(
      'playbackChange',
      setState({
        isPlaying: true,
      }),
    );
  };

  const stop = () => {
    pubSub.dispatch(
      'playbackChange',
      setState({
        isPlaying: false,
      }),
    );
  };

  const setTempo = (bpm: Bpm) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pubSub.dispatch(
      'tempoChange',
      setState({
        tempo: bpm,
      }),
    );
  };

  // SELECTORS
  const getTempo = () => {
    return state.tempo;
  };

  const getIsPlaying = () => {
    return state.isPlaying;
  };

  return {
    actions: {
      play,
      stop,
      setTempo,
    },
    selectors: {
      getTempo,
      getIsPlaying,
    },
    dispose,
  };
};
