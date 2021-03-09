/* eslint-disable no-console */
import type { Project } from './projectStructure';
import { getDefaultProject } from './getDefaultProject';
import { getSceneById, getSlotById, getTimelineById } from './selectors';
import { ActionType } from '../..';
import type { MusicTime } from '../utils/musicTime';
import { createTimeline } from '../timeline/timeline';
import { createSampler } from '../instruments/sampler';

// takes a project config and returns some useful stuff
// so we don't have to interact with the file directly
export const createProject = (project: Project = getDefaultProject()) => {
  // TODO: validate project before doing anything else (make sure ids are correct and unique, etc)

  const startScenes = project.startScenes.map(getSceneById(project));

  const startSlots = startScenes.flatMap((scene) => {
    const playSlotsActions = (scene.eventActions.enter || []).filter((action) => {
      return action.type === ActionType.PlaySlots;
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

  // given a start and end time, return notes to schedule with respective instruments
  const getScheduleItems = (start: MusicTime, end: MusicTime) => {
    return startSlots.flatMap((slot) => {
      const timeline = createTimeline(
        getTimelineById(project)(slot.timelineId),
        project.entities.clips,
      );

      const notesWithChannels = getChannelsBySlotId(slot.id).map((channel) => {
        return {
          notes: timeline.getNotesInRange(start, end),
          channel,
        };
      });

      // TODO: refactor
      return notesWithChannels.map((notesWithChannel) => {
        return {
          instrument,
          notes: notesWithChannel.notes,
        };
      });
    });
  };

  return {
    getScheduleItems,
  };
};
