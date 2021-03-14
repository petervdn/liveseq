import type { Bpm, TimeInSeconds } from '../time/time';
import type { ScheduleItem } from '../player/player';
import { timeRangeToBeatsRange } from '../time/timeRange.utils';
import { getTimelineClips, getTimelineNotesInRange } from '../entities/timeline/timeline.utils';
import { beatsToTime } from '../time/musicTime';
import type { Entities } from '../entities/entities';
import { getChannelsBySlotId } from '../entities/entities';

export const getScheduleItems = (
  entities: Entities,
  slotIds: Array<string>,
  startTime: TimeInSeconds,
  endTime: TimeInSeconds,
  bpm: Bpm,
): Array<ScheduleItem> => {
  const beatsRange = timeRangeToBeatsRange({ start: startTime, end: endTime }, bpm);

  return slotIds.flatMap((slotId) => {
    const slot = entities.slots[slotId];
    const timeline = entities.timelines[slot.timelineId];
    const timelineClips = getTimelineClips(timeline, entities.clips);
    const channels = getChannelsBySlotId(entities.channels, slot.id);

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
