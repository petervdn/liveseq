import type { ScheduleItem } from './player';
import { getTimelineNotesInRange } from '../entities/timeline/getTimelineNotesInRange';
import { beatsToTime } from '../time/musicTime';
import type { Entities } from '../entities/entities';
import type { BeatsRange } from '../time/beatsRange';
import type { Bpm } from '../types';
import { getInstrumentChannelsBySlotId } from '../entities/getInstrumentChannelsBySlotId';
import { getClipsByTimelineId } from '../entities/getClipsByTimelineId';

export const getNotesForInstrumentInTimeRange = (
  entities: Entities,
  activeSlotIds: Array<string>,
  beatsRange: BeatsRange,
  bpm: Bpm,
  previouslyScheduledNoteIds: Array<string>,
): Array<ScheduleItem> => {
  return activeSlotIds.flatMap((slotId) => {
    const slot = entities.slots[slotId];
    const timeline = entities.timelines[slot.timelineId];
    const timelineClips = getClipsByTimelineId(entities, timeline.id);
    const channels = getInstrumentChannelsBySlotId(entities, slot.id);

    return channels.reduce((accumulator, channel) => {
      const notes = getTimelineNotesInRange(
        beatsRange,
        timeline,
        timelineClips,
        channel.id,
        slot.id,
        slot.loops,
        previouslyScheduledNoteIds,
      );

      if (notes.length === 0) return accumulator;

      const instrument = entities.samplers[channel.samplerId];

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
