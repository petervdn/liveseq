import type { BeatsRange } from '../../time/beatsRange';
import type { EntityEntries } from '../../entities/entities';
import type { Bpm } from '../../types';
import { getNotesForInstrumentInTimeRange } from '../../entities/utils/getNotesForInstrumentInTimeRange';
import { getSlotPlaybackStatesWithinRange } from './getSlotPlaybackStatesWithinRange';
import type { SlotPlaybackState } from '../scheduler';

export const getScheduleItemsWithinRange = (
  beatsRange: BeatsRange,
  entities: EntityEntries,
  bpm: Bpm,
  slotPlaybackState: SlotPlaybackState,
  previouslyScheduledNoteIds: Array<string>,
) => {
  // we must split the beatsRange into sections where the playing slots in the slotPlaybackState changes
  const slotPlaybackStates = getSlotPlaybackStatesWithinRange(
    beatsRange,
    entities,
    slotPlaybackState,
  );

  // the first slotPlaybackState becomes the new slotPlaybackState assuming we always move ahead in time
  // TODO: make sure this is correct
  const nextSlotPlaybackState = slotPlaybackStates[0];

  // then we get schedule items according to those split ranges and their playing slots
  const scheduleItems = slotPlaybackStates.flatMap((slotRange) => {
    const slotIds = slotRange.playingSlots.map((slot) => slot.slotId);

    return getNotesForInstrumentInTimeRange(
      entities,
      slotIds,
      beatsRange,
      bpm,
      previouslyScheduledNoteIds,
    );
  });

  return {
    nextSlotPlaybackState,
    scheduleItems,
  };
};
