import { isSameQueuedScene } from './isSameQueuedScene';
import type { QueuedScene, SlotPlaybackState } from '../scheduler';

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
