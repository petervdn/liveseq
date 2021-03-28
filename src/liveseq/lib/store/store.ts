import { createSlotPlaybackState, SlotPlaybackState } from '../player/slotPlaybackState';
import type { LiveseqCallbacks } from '../liveseq';
import type { Bpm } from '../types';

type PlaybackStates = 'playing' | 'paused' | 'stopped';

export type LiveseqState = {
  playbackState: PlaybackStates;
  activeSceneIds: Array<string>;
  tempo: Bpm;
  slotPlaybackState: SlotPlaybackState;
};

export const createStore = (
  initialState: Partial<LiveseqState> = {},
  callbacks: LiveseqCallbacks,
) => {
  const defaultState: LiveseqState = {
    playbackState: 'stopped',
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
    if (state.playbackState === 'playing') return;

    setState({
      playbackState: 'playing',
    });

    callbacks.onPlay();
  };

  const pause = () => {
    if (state.playbackState === 'paused') return;

    setState({
      playbackState: 'paused',
    });

    callbacks.onPause();
  };

  const stop = () => {
    if (state.playbackState === 'stopped') return;

    setState({
      playbackState: 'stopped',
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
    return state.playbackState === 'playing';
  };

  const getIsPaused = () => {
    return state.playbackState === 'paused';
  };

  const getIsStopped = () => {
    return state.playbackState === 'stopped';
  };

  const getSlotPlaybackState = () => {
    return state.slotPlaybackState;
  };

  return {
    actions: {
      play,
      pause,
      stop,
      setTempo,
      setSlotPlaybackState,
    },
    selectors: {
      getTempo,
      getIsPlaying,
      getIsPaused,
      getIsStopped,
      getSlotPlaybackState,
    },
    dispose,
  };
};
