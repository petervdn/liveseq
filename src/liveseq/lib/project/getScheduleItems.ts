import { getChannelsBySlotId, getTimelineById } from './selectors';
import type { Project } from './project';
import type { Bpm, TimeInSeconds } from '../time/time';
import type { ScheduleItem } from '../player/player';
import { timeRangeToBeatsRange } from '../time/timeRange.utils';
import { getTimelineClips, getTimelineNotesInRange } from '../entities/timeline/timeline.utils';
import { beatsToTime } from '../time/musicTime';
import { createSampler } from '../entities/instrument/sampler';
import { getStartSlots } from './getStartSlots';

export const getScheduleItems = (
  project: Project,
  startTime: TimeInSeconds,
  endTime: TimeInSeconds,
  bpm: Bpm,
): Array<ScheduleItem> => {
  const startSlots = getStartSlots(project);

  const instrument = createSampler({});

  const beatsRange = timeRangeToBeatsRange({ start: startTime, end: endTime }, bpm);

  return startSlots.flatMap((slot) => {
    const timeline = getTimelineById(project)(slot.timelineId);
    const timelineClips = getTimelineClips(timeline, project.entities.clips);

    const notesWithChannels = getChannelsBySlotId(project, slot.id)
      .map((channel) => {
        return {
          notes: getTimelineNotesInRange(beatsRange, timeline, timelineClips, channel.id, slot.id),
          channel,
        };
      })
      .filter(({ notes }) => {
        // remove the ones that have no notes
        return notes.length > 0;
      });

    return notesWithChannels.map(
      (notesWithChannel): ScheduleItem => {
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
