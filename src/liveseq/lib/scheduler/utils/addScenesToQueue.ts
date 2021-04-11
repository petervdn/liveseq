import type { QueuedScene, SlotPlaybackState } from '../schedulerState';

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
