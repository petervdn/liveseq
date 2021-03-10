/* eslint-disable no-console */
import type { Project } from './projectStructure';
import { getDefaultProject } from './getDefaultProject';
import { getSceneById, getSlotById, getTimelineById } from './selectors';

import { createSampler } from '../entities/instrument/sampler';
import { beatsToTime, Bpm, TimeInSeconds } from '../utils/musicTime';
import type { ScheduleItem } from '../player/player';
import { getTimelineClips, getTimelineNotesInRange } from '../entities/timeline/timeline';
import { timeRangeToBeatsRange } from '../utils/beatsRange';

// takes a project config and returns some useful stuff
// so we don't have to interact with the file directly
export const createProject = (project: Project = getDefaultProject()) => {
  // TODO: validate project before doing anything else (make sure ids are correct and unique, etc)

  const startScenes = project.startScenes.map(getSceneById(project));

  const startSlots = startScenes.flatMap((scene) => {
    const playSlotsActions = (scene.eventActions.enter || []).filter((action) => {
      return action.type === 'playSlots';
    });

    return playSlotsActions.flatMap((action) => {
      return (action.slotIds || []).map(getSlotById(project));
    });
  });

  // returns which channels contain the slot
  const getChannelsBySlotId = (slotId: string) => {
    return project.entities.channels.filter((channel) => {
      return channel.slotIds.includes(slotId);
    });
  };

  const instrument = createSampler({});

  // given a start and end time and a bpm, return notes to schedule with respective instruments
  const getScheduleItems = (
    startTime: TimeInSeconds,
    endTime: TimeInSeconds,
    bpm: Bpm,
  ): Array<ScheduleItem> => {
    const beatsRange = timeRangeToBeatsRange({ start: startTime, end: endTime }, bpm);

    return startSlots.flatMap((slot) => {
      const timeline = getTimelineById(project)(slot.timelineId);
      const timelineClips = getTimelineClips(timeline, project.entities.clips);

      const notesWithChannels = getChannelsBySlotId(slot.id)
        .map((channel) => {
          return {
            notes: getTimelineNotesInRange(
              beatsRange,
              timeline,
              timelineClips,
              channel.id,
              slot.id,
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

  return {
    getScheduleItems,
  };
};
