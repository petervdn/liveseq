import { addScenesToQueue } from './utils/addScenesToQueue';
import { removeScenesFromQueue } from './utils/removeScenesFromQueue';
import type { Beats } from '../../../time/types';

export type PlayingSlot = {
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
  const initialSlotPlaybackState = initialState.slotPlaybackState || createSlotPlaybackState();
  let state: SchedulerState = {
    slotPlaybackState: initialSlotPlaybackState,
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
    setState({
      slotPlaybackState: {
        ...state.slotPlaybackState,
        queuedScenes: addScenesToQueue([scene], state.slotPlaybackState.queuedScenes),
      },
    });
  };

  const removeSceneFromQueue = (scene: QueuedScene) => {
    setState({
      slotPlaybackState: {
        ...state.slotPlaybackState,
        queuedScenes: removeScenesFromQueue([scene], state.slotPlaybackState.queuedScenes),
      },
    });
  };

  const reset = () => {
    setState({
      slotPlaybackState: initialSlotPlaybackState,
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
    reset,
    dispose,
  };
};
