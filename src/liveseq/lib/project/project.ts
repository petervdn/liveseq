/* eslint-disable no-console */
import type { Project } from './projectStructure';
import { getDefaultProject } from './getDefaultProject';
import { getSceneById, getSlotById, getTimelineById } from './selectors';

import { createTimeline } from '../entities/timeline/timeline';
import { createSampler } from '../entities/instrument/sampler';
import { musicTimeToTime, timeToMusicTime } from '../utils/musicTime';
import type { ScheduleItem } from '../player/player';

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
  const getScheduleItems = (start: number, end: number, bpm: number): Array<ScheduleItem> => {
    const musicStartTime = timeToMusicTime(start, bpm);
    const musicEndTime = timeToMusicTime(end, bpm);

    return startSlots.flatMap((slot) => {
      const timeline = createTimeline(
        getTimelineById(project)(slot.timelineId),
        project.entities.clips,
      );

      const notesWithChannels = getChannelsBySlotId(slot.id)
        .map((channel) => {
          return {
            notes: timeline.getNotesInRange(musicStartTime, musicEndTime),
            channel,
          };
        })
        .filter(({ notes }) => {
          // remove the ones that have no notes
          return notes.length > 0;
        });

      return notesWithChannels.map((notesWithChannel) => {
        return {
          instrument,
          notes: notesWithChannel.notes.map((note) => {
            return {
              ...note,
              startTime: musicTimeToTime(note.start, bpm),
              endTime: musicTimeToTime(note.end, bpm),
            };
          }),
        };
      });
    });
  };

  return {
    getScheduleItems,
  };
};
