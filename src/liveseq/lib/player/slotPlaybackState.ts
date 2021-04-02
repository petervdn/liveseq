import type { BeatsRange } from '../time/beatsRange';
import type { Beats } from '../types';

type PlayingSlot = {
  slotId: string;
  start: Beats;
};

export type QueuedScene = BeatsRange & {
  sceneId: string;
};

export type SlotPlaybackState = {
  playingSlots: Array<PlayingSlot>;
  activeSceneIds: Array<string>;
  queuedScenes: Array<QueuedScene>;
};

export const createSlotPlaybackState = (): SlotPlaybackState => {
  const defaultSlotPlaybackState = {
    playingSlots: [],
    activeSceneIds: [],
    queuedScenes: [],
  };

  return defaultSlotPlaybackState;
};

export const addScenesToQueue = (
  scenes: Array<QueuedScene>,
  slotPlaybackState: SlotPlaybackState,
): SlotPlaybackState => {
  return {
    ...slotPlaybackState,
    queuedScenes: slotPlaybackState.queuedScenes.concat(scenes).sort((sceneA, sceneB) => {
      // eslint-disable-next-line no-nested-ternary
      return sceneA.start < sceneB.start ? -1 : sceneA.start > sceneB.start ? 1 : 0;
    }),
  };
};

const isSameQueuedScene = (queuedSceneA: QueuedScene, queuedSceneB: QueuedScene) => {
  return queuedSceneA.sceneId === queuedSceneB.sceneId && queuedSceneA.start === queuedSceneB.start;
};

export const removeScenesFromQueue = (
  scenes: Array<QueuedScene>,
  slotPlaybackState: SlotPlaybackState,
): SlotPlaybackState => {
  return {
    ...slotPlaybackState,
    queuedScenes: slotPlaybackState.queuedScenes.filter((queuedSceneA) => {
      return !scenes.find((queuedSceneB) => isSameQueuedScene(queuedSceneA, queuedSceneB));
    }),
  };
};
