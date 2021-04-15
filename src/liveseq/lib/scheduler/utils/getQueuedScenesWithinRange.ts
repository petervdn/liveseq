import type { BeatsRange } from '../../time/beatsRange/beatsRange';
import { isTimeInRange } from '../../time/beatsRange/isTimeInRange';
import type { QueuedScene, SlotPlaybackState } from '../schedulerState';

// find the scenes that will get triggered in the beatsRange
export const getQueuedScenesWithinRange = (
  beatsRange: BeatsRange,
  slotPlaybackState: SlotPlaybackState,
): Array<QueuedScene> => {
  return slotPlaybackState.queuedScenes.filter((queuedScene) => {
    // TODO: maybe .start is not enough a check since it also has an end
    return isTimeInRange(queuedScene.start, beatsRange);
  });
};
