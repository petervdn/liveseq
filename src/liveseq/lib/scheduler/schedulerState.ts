import { addScenesToQueue } from './utils/addScenesToQueue';
import { removeScenesFromQueue } from './utils/removeScenesFromQueue';
import type { Beats } from '../types';

type PlayingSlot = {
  slotId: string;
  start: Beats;
};

export type QueuedScene = {
  sceneId: string;
  start: Beats;
};

// TODO: needs to be rethought, if scenes operate on playing slots then the queue might be something else
export type SlotPlaybackState = {
  playingSlots: Array<PlayingSlot>;
  queuedScenes: Array<QueuedScene>;
};

export const createSlotPlaybackState = (): SlotPlaybackState => {
  const defaultSlotPlaybackState = {
    playingSlots: [],
    queuedScenes: [],
  };

  return defaultSlotPlaybackState;
};

export type SchedulerState = {
  slotPlaybackState: SlotPlaybackState;
};

export const createSchedulerState = (initialState: Partial<SchedulerState>) => {
  let state: SchedulerState = {
    slotPlaybackState: initialState.slotPlaybackState || createSlotPlaybackState(),
  };

  const getSlotPlaybackState = () => {
    return state.slotPlaybackState;
  };

  // TODO: this is repeated in Player as well
  const setState = (newState: Partial<SchedulerState>) => {
    // mutation!
    state = {
      ...state,
      ...newState,
    };
    return state;
  };

  const setSlotPlaybackState = (slotPlaybackState: SlotPlaybackState) => {
    setState({
      slotPlaybackState,
    });
  };

  const addSceneToQueue = (scene: QueuedScene) => {
    // TODO: consider duplicates
    setState({
      slotPlaybackState: addScenesToQueue([scene], state.slotPlaybackState),
    });
  };

  const removeSceneFromQueue = (scene: QueuedScene) => {
    // TODO: consider duplicates
    setState({
      slotPlaybackState: removeScenesFromQueue([scene], state.slotPlaybackState),
    });
  };

  const dispose = () => {
    //
  };

  return {
    getSlotPlaybackState,
    setSlotPlaybackState,
    addSceneToQueue,
    removeSceneFromQueue,
    dispose,
  };
};
