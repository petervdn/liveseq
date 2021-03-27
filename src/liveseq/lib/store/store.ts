import type { SerializableProject } from '../project/project';
import type { Bpm } from '../time/time';
import { createSlotPlaybackState, SlotPlaybackState } from '../player/slotPlaybackState';
import type { LiveseqCallbacks } from '../liveseq';
import { createProject } from '../project/project';

export type LiveseqState = {
  isPlaying: boolean;
  project: SerializableProject;
  activeSceneIds: Array<string>;
  tempo: Bpm;
  slotPlaybackState: SlotPlaybackState;
};

export const createStore = (
  initialState: Partial<LiveseqState> = {},
  callbacks: LiveseqCallbacks,
) => {
  const defaultState: LiveseqState = {
    isPlaying: false,
    project: createProject(),
    activeSceneIds: [],
    tempo: 120 as Bpm,
    slotPlaybackState: createSlotPlaybackState(),
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
    if (state.isPlaying === true) return;

    setState({
      isPlaying: true,
    });

    callbacks.onPlay();
  };

  const stop = () => {
    if (state.isPlaying === false) return;

    setState({
      isPlaying: false,
    });

    callbacks.onStop();
  };

  const setTempo = (bpm: Bpm) => {
    if (state.tempo === bpm) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setState({
      tempo: bpm,
    });

    callbacks.onTempoChange();
  };

  const setSlotPlaybackState = (slotPlaybackState: SlotPlaybackState) => {
    setState({
      slotPlaybackState,
    });
  };

  // SELECTORS
  const getTempo = () => {
    return state.tempo;
  };

  const getIsPlaying = () => {
    return state.isPlaying;
  };

  const getSlotPlaybackState = () => {
    return state.slotPlaybackState;
  };

  return {
    actions: {
      play,
      stop,
      setTempo,
      setSlotPlaybackState,
    },
    selectors: {
      getTempo,
      getIsPlaying,
      getSlotPlaybackState,
    },
    dispose,
  };
};
