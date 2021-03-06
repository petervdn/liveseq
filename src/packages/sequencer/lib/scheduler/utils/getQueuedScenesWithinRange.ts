import type { QueuedScene, SlotPlaybackState } from '../schedulerState';
import type { BeatsRange } from '../../../../core/lib/types';
import { isTimeInRange } from '../../../../range';

// find the scenes that will get triggered in the beatsRange
export const getQueuedScenesWithinRange = (
  beatsRange: BeatsRange,
  slotPlaybackState: SlotPlaybackState,
): Array<QueuedScene> => {
  return slotPlaybackState.queuedScenes.filter((queuedScene) => {
    return isTimeInRange(queuedScene.start, beatsRange);
  });
};
