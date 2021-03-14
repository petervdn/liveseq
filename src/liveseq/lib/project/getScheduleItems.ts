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

    const notesWithChannels = getChannelsBySlotId(entities.channels, slot.id)
      .map((channel) => {
        return {
          notes: getTimelineNotesInRange(
            beatsRange,
            timeline,
            timelineClips,
            channel.id,
            slot.id,
            slot.loops,
          ),
          channel,
        };
      })
      .filter(({ notes }) => {
        // remove the ones that have no notes
        return notes.length > 0;
      });

    return notesWithChannels.map(
      (notesWithChannel): ScheduleItem => {
        const instrument = entities.instruments[notesWithChannel.channel.instrumentId];

        return {
          instrument,
          notes: notesWithChannel.notes.map((note) => {
            return {
              ...note,
              startTime: beatsToTime(note.start, bpm),
              endTime: beatsToTime(note.end, bpm),
            };
          }),
        };
      },
    );
  });
};
