/* eslint-disable no-console */
import type { Project } from './projectStructure';
import { getDefaultProject } from './getDefaultProject';
import { getSceneById, getSlotById, getTimelineById } from './selectors';
import { ActionType } from '../..';
import type { MusicTime } from '../utils/musicTime';
import { createTimeline } from '../timeline/timeline';

// takes a project config and returns some useful stuff
// so we don't have to interact with the file directly
export const createProject = (project: Project = getDefaultProject()) => {
  // TODO: validate project before doing anything else (make sure ids are correct and unique, etc)

  const startScenes = project.startScenes.map(getSceneById(project));

  const startSlots = startScenes.flatMap((scene) => {
    const playSlotsActions = (scene.eventActions.enter || []).filter((action) => {
      return action.type === ActionType.PlaySlots;
    });

    const slotsToPlay = playSlotsActions.flatMap((action) => {
      return (action.slotIds || []).map(getSlotById(project));
    });

    return slotsToPlay;
  });

  // returns which channels contain the slot
  const getChannelsBySlotId = (slotId: string) => {
    return project.entities.channels.filter((channel) => {
      return channel.slotIds.includes(slotId);
    });
  };

  const playingChannels = startSlots.flatMap((slot) => {
    const channels = getChannelsBySlotId(slot.id);

    channels.forEach((channel) => {
      console.log(slot.timelineId, '->', slot.id, '->', channel.id, '->', channel.instrumentId);
    });

    return channels;
  });

  console.log('when we play liveseq, these scenes will trigger:');
  console.log(startScenes);
  console.log('those scenes will make these slots play:');
  console.log(startSlots);
  console.log('those slots are in these channels:');
  console.log(playingChannels);

  // given a start and end time, what notes should play on what instruments?
  // TODO: this is a wip
  const getNotesToPlay = (start: MusicTime, end: MusicTime) => {
    //  TODO: return a reference of the instruments to play

    const timelines = startSlots.map((slot) => getTimelineById(project)(slot.timelineId));
    // TODO: naming
    const timelineInstances = timelines.map((timeline) =>
      createTimeline(timeline, project.entities.clips),
    );

    const notesToPlay = timelineInstances.flatMap((tl) => tl.getNotesInRange(start, end));

    return notesToPlay;
  };

  return {
    getNotesToPlay,
  };
};
