import type { BeatsRange } from '../../time/beatsRange/beatsRange';
import { isTimeInRange } from '../../time/beatsRange/isTimeInRange';
import type { QueuedScene, SlotPlaybackState } from '../schedulerState';

// find the scenes that will get triggered in the beatsRange
export const getQueuedScenesWithinRange = (
  beatsRange: BeatsRange,
  slotPlaybackState: SlotPlaybackState,
): Array<QueuedScene> => {
  return slotPlaybackState.queuedScenes.filter((queuedScene) => {
    return isTimeInRange(queuedScene.start, beatsRange);
  });
};
