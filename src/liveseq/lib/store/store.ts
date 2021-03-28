import { createSlotPlaybackState, SlotPlaybackState } from '../player/slotPlaybackState';
import type { EngineCallbacks } from '../engine';
import type { Bpm } from '../types';

// TODO: better naming (rename some keys in objs as well)
type PlaybackStates = 'playing' | 'paused' | 'stopped';

export type LiveseqState = {
  playbackState: PlaybackStates;
  tempo: Bpm;
  slotPlaybackState: SlotPlaybackState;
  isMuted: boolean;
};

export type StoreSelectors = {
  getIsStopped: () => boolean;
  getIsMuted: () => boolean;
  getTempo: () => Bpm;
  getIsPlaying: () => boolean;
  getIsPaused: () => boolean;
  getSlotPlaybackState: () => SlotPlaybackState;
};

export type StoreActions = {
  setPlaybackState: (playbackState: PlaybackStates) => void;
  setIsMuted: (isMuted: boolean) => void;
  setTempo: (bpm: Bpm) => void;
  setSlotPlaybackState: (slotPlaybackState: SlotPlaybackState) => void;
};

export type Store = {
  selectors: StoreSelectors;
  actions: StoreActions;
  dispose: () => void;
};

export const createStore = (
  initialState: Partial<LiveseqState> = {},
  callbacks: EngineCallbacks,
): Store => {
  const defaultState: LiveseqState = {
    playbackState: 'stopped',
    tempo: 120 as Bpm,
    slotPlaybackState: createSlotPlaybackState(),
    isMuted: false,
  };

  let state = {
    ...defaultState,
    ...initialState,
  };

  // UTILS
  const setState = (newState: Partial<LiveseqState>) => {
    // mutation!
    state = {
      ...state,
      ...newState,
    };
    return state;
  };

  // SELECTORS
  const getTempo = () => {
    return state.tempo;
  };

  const getIsPlaying = () => {
    return state.playbackState === 'playing';
  };

  const getIsPaused = () => {
    return state.playbackState === 'paused';
  };

  const getIsStopped = () => {
    return state.playbackState === 'stopped';
  };

  const getIsMuted = () => {
    return state.isMuted;
  };

  const getSlotPlaybackState = () => {
    return state.slotPlaybackState;
  };

  // ACTIONS
  const setPlaybackState = (playbackState: PlaybackStates) => {
    if (state.playbackState === playbackState) return;

    setState({
      playbackState,
    });

    if (getIsPlaying()) {
      callbacks.onPlay();
    } else if (getIsPaused()) {
      callbacks.onPause();
    } else if (getIsStopped()) {
      callbacks.onStop();
    }
  };

  const setIsMuted = (isMuted: boolean) => {
    if (getIsMuted() === isMuted) return;

    setState({
      isMuted,
    });
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

  // CORE
  const dispose = () => {
    // nothing to do here yet
  };

  return {
    selectors: {
      getTempo,
      getIsPlaying,
      getIsPaused,
      getIsStopped,
      getIsMuted,
      getSlotPlaybackState,
    },
    actions: {
      setPlaybackState,
      setIsMuted,
      setTempo,
      setSlotPlaybackState,
    },
    dispose,
  };
};
