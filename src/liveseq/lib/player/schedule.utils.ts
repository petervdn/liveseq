import type { Bpm, TimeInSeconds } from '../time/time';
import type { ScheduleItem } from './player';
import { getTimelineNotesInRange } from '../entities/timeline/timeline.utils';
import { beatsToTime } from '../time/musicTime';
import type { Entities } from '../entities/entities';
import { getChannelsBySlotId, getClipsByTimelineId } from '../entities/entities';
import { timeRangeToBeatsRange } from '../time/beatsRange';

//
export const getNotesForInstrumentInTimeRange = (
  entities: Entities,
  activeSlotIds: Array<string>,
  startTime: TimeInSeconds,
  endTime: TimeInSeconds,
  bpm: Bpm,
): Array<ScheduleItem> => {
  const beatsRange = timeRangeToBeatsRange({ start: startTime, end: endTime }, bpm);

  return activeSlotIds.flatMap((slotId) => {
    const slot = entities.slots[slotId];
    const timeline = entities.timelines[slot.timelineId];
    const timelineClips = getClipsByTimelineId(entities, timeline.id);
    const channels = getChannelsBySlotId(entities, slot.id);

    return channels.reduce((accumulator, channel) => {
      const notes = getTimelineNotesInRange(
        beatsRange,
        timeline,
        timelineClips,
        channel.id,
        slot.id,
        slot.loops,
      );

      if (notes.length === 0) return accumulator;

      const instrument = entities.instruments[channel.instrumentId];

      accumulator.push({
        instrument,
        notes: notes.map((note) => {
          return {
            ...note,
            startTime: beatsToTime(note.start, bpm),
            endTime: beatsToTime(note.end, bpm),
          };
        }),
      });

      return accumulator;
    }, [] as Array<ScheduleItem>);
  });
};

export type GetScheduleItemsResult = {
  previouslyScheduledNoteIds: Array<string>;
  notesToScheduleForInstrument: Array<ScheduleItem>;
};
export const getScheduleItems = (
  entities: Entities,
  activeSlotIds: Array<string>,
  startTime: TimeInSeconds,
  endTime: TimeInSeconds,
  bpm: Bpm,
  previouslyScheduledNoteIds: Array<string>,
): GetScheduleItemsResult => {
  // get all notes
  const notesInTimeRange = getNotesForInstrumentInTimeRange(
    entities,
    activeSlotIds,
    startTime,
    endTime,
    bpm,
  );

  // get rid of the ones that have already been scheduled
  return notesInTimeRange.reduce<GetScheduleItemsResult>(
    (result, notesForInstrument) => {
      const filteredNotes = notesForInstrument.notes.filter((note) => {
        const hasBeenScheduled = result.previouslyScheduledNoteIds.includes(note.schedulingId);
        if (hasBeenScheduled) {
          // eslint-disable-next-line no-console
          console.log('skipping', note.schedulingId);
        }
        return !hasBeenScheduled;
      });

      return {
        previouslyScheduledNoteIds: [
          ...result.previouslyScheduledNoteIds,
          ...filteredNotes.map((note) => note.schedulingId),
        ],
        notesToScheduleForInstrument:
          filteredNotes.length > 0
            ? [
                ...result.notesToScheduleForInstrument,
                { notes: filteredNotes, instrument: notesForInstrument.instrument },
              ]
            : result.notesToScheduleForInstrument,
      };
    },
    { previouslyScheduledNoteIds, notesToScheduleForInstrument: [] },
  );
};