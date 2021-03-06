import { getTimelineNotesInRange } from './getTimelineNotesInRange';
import type { EntityEntries } from '../entities';
import { getInstrumentChannelsBySlotId } from './getInstrumentChannelsBySlotId';
import { getClipsByTimelineId } from './getClipsByTimelineId';
import type { ScheduleItem } from '../../scheduler/scheduler';
import type { BeatsRange, Bpm } from '../../../../core/lib/types';
import { beatsToTime } from '../../../../core/lib/time/beatsToTime';

export const getNotesForInstrumentInTimeRange = (
  entities: EntityEntries,
  activeSlotIds: Array<string>,
  beatsRange: BeatsRange,
  bpm: Bpm,
): Array<ScheduleItem> => {
  return activeSlotIds.flatMap((slotId) => {
    const slot = entities.slots.get(slotId);
    const timeline = entities.timelines.get(slot.timelineId);
    const timelineClips = getClipsByTimelineId(entities, timeline.id);
    const channels = getInstrumentChannelsBySlotId(entities, slot.id);

    return channels.reduce((accumulator, instrumentChannel) => {
      const notes = getTimelineNotesInRange(
        beatsRange,
        timeline,
        timelineClips,
        instrumentChannel.id,
        slot.id,
        slot.loops,
      );

      if (notes.length === 0) return accumulator;

      // TODO: need to check what kind of instrument before assuming sampler
      const instrument = entities.samplers.get(instrumentChannel.instrumentId);

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
