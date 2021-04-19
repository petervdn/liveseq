import type { QueuedScene } from '../schedulerState';

export const addScenesToQueue = (
  scenes: Array<QueuedScene>,
  queuedScenes: Array<QueuedScene>,
): Array<QueuedScene> => {
  return queuedScenes
    .concat(
      scenes.filter(
        (scene) => !queuedScenes.find((queuedScene) => queuedScene.sceneId === scene.sceneId),
      ),
    )
    .sort((sceneA, sceneB) => {
      // eslint-disable-next-line no-nested-ternary
      return sceneA.start < sceneB.start ? -1 : sceneA.start > sceneB.start ? 1 : 0;
    });
};
