import type { BeatsRange } from '../../time/beatsRange';
import type { EntityEntries } from '../../entities/entities';
import type { Bpm } from '../../types';
import { getNotesForInstrumentInTimeRange } from '../../entities/utils/getNotesForInstrumentInTimeRange';
import type { SlotPlaybackState } from '../scheduler';

// TODO: remove this as it is built in now
export const getScheduleItemsWithinRange = (
  entities: EntityEntries,
  bpm: Bpm,
  slotPlaybackStates: Array<BeatsRange & SlotPlaybackState>,
) => {
  // get schedule items according to split slotPlaybackState ranges and their playing slots
  return slotPlaybackStates.flatMap((slotRange) => {
    const slotIds = slotRange.playingSlots.map((slot) => slot.slotId);

    return getNotesForInstrumentInTimeRange(entities, slotIds, slotRange, bpm);
  });
};
