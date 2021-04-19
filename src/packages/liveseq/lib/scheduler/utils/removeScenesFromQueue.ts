import { isSameQueuedScene } from './isSameQueuedScene';
import type { QueuedScene } from '../schedulerState';

export const removeScenesFromQueue = (
  scenes: Array<QueuedScene>,
  queuedScenes: Array<QueuedScene>,
): Array<QueuedScene> => {
  return queuedScenes.filter((queuedSceneA) => {
    return !scenes.find((queuedSceneB) => isSameQueuedScene(queuedSceneA, queuedSceneB));
  });
};
