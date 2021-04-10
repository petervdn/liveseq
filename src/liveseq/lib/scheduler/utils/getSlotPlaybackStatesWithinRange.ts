import type { BeatsRange } from '../../time/beatsRange';
import type { EntityEntries } from '../../entities/entities';
import { groupQueuedScenesByStart } from './groupQueuedScenesByStart';
import { getQueuedScenesWithinRange } from './getQueuedScenesWithinRange';
import { getAppliedStatesForQueuedScenes } from './getAppliedStatesForQueuedScenes';
import type { SlotPlaybackState } from '../scheduler';

// TODO: we don't need this anymore as it is internal to schedule atm
// given a range and a slotPlaybackState, get an array of slotPlaybackState with the respective sub ranges
export const getSlotPlaybackStatesWithinRange = (
  beatsRange: BeatsRange,
  entities: EntityEntries,
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
