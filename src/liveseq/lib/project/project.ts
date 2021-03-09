/* eslint-disable no-console */
import type { Project } from './projectStructure';
import { getDefaultProject } from './getDefaultProject';
import { getSceneById, getSlotById, getTimelineById } from './selectors';
import { ActionType, playTick } from '../..';
import type { MusicTime } from '../utils/musicTime';
import { createTimeline } from '../timeline/timeline';
import type { ScheduleNote } from '../player/player';

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

  // const playingChannels = startSlots.flatMap((slot) => {
  //   const channels = getChannelsBySlotId(slot.id);
  //
  //   channels.forEach((channel) => {
  //     console.log(slot.timelineId, '->', slot.id, '->', channel.id, '->', channel.instrumentId);
  //   });
  //
  //   return channels;
  // });

  // console.log('when we play liveseq, these scenes will trigger:');
  // console.log(startScenes);
  // console.log('those scenes will make these slots play:');
  // console.log(startSlots);
  // console.log('those slots are in these channels:');
  // console.log(playingChannels);

  // Hardcoded tick
  // TODO:create sampler and synth
  const instrument = {
    schedule: (context: AudioContext, notes: Array<ScheduleNote>) => {
      notes.forEach((note) => {
        playTick(context, note.startTime, note.startTime + note.endTime);
      });
    },
  };

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

      // export type ScheduleItem = {
      //   notes: Array<ScheduleNote>;
      //   instrument: {
      //     // when the player calls instrument.schedule, it will already pass notes with time in seconds
      //     // TODO: maybe the instrument returns a "cancel" fn
      //     schedule: (context: AudioContext, notes: Array<ScheduleNote>) => void;
      //   };
      // };
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
