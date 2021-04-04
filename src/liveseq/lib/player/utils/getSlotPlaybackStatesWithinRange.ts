import type { BeatsRange } from '../../time/beatsRange';
import type { SlotPlaybackState } from '../slotPlaybackState';
import type { Entities } from '../../entities/entities';
import { groupQueuedScenesByStart } from './groupQueuedScenesByStart';
import { getQueuedScenesWithinRange } from './getQueuedScenesWithinRange';
import { getAppliedStatesForQueuedScenes } from './getAppliedStatesForQueuedScenes';

// given a range and a slotPlaybackState, get an array of slotPlaybackState with the respective sub ranges
export const getSlotPlaybackStatesWithinRange = (
  beatsRange: BeatsRange,
  entities: Entities,
  slotPlaybackState: SlotPlaybackState,
): Array<BeatsRange & SlotPlaybackState> => {
  const queuedScenes = getQueuedScenesWithinRange(beatsRange, slotPlaybackState);

  const queuedScenesByStart = groupQueuedScenesByStart(beatsRange.start, queuedScenes);

  return getAppliedStatesForQueuedScenes(
    beatsRange,
    queuedScenesByStart,
    entities,
    slotPlaybackState,
  );
};
