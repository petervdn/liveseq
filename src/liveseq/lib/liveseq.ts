import { createStore } from './store/store';

import type { SerializableProject } from './project/project';
import type { Bpm, TimeInSeconds } from './time/time';

import { createEntities } from './entities/entities';
import { getScheduleItemsWithinRange } from './player/slotPlaybackState';
import { timeRangeToBeatsRange } from './time/beatsRange';
import type { TimeRange } from './time/timeRange';

import { createPlayer, ScheduleNote } from './player/player';

import { errors } from './errors';
import { validateProject } from './project/validateProject';

import { getDefaultProps } from './utils/getDefaultProps';

export type CommonProps = {
  id: string;
  name?: string;
  isEnabled?: boolean;
};

export type LiveseqCallbacks = {
  onPlay: () => void;
  onStop: () => void;
  onTempoChange: () => void;
};

export type LiveseqProps = LiveseqCallbacks & {
  project: SerializableProject;
  audioContext: AudioContext;
  lookAheadTime: TimeInSeconds;
  scheduleInterval: TimeInSeconds;
};

export type Liveseq = {
  play: () => void;
  audioContext: AudioContext | undefined;
  stop: () => void;
  setTempo: (bpm: Bpm) => void;
  getTempo: () => Bpm;
  dispose: () => void;
  getScheduleItemsInfo: (timeRange: TimeRange) => Array<{ notes: Array<ScheduleNote> }>;
  getIsPlaying: () => boolean;
  getProject: () => SerializableProject | undefined;
};

export type PartialLiveseqProps = Partial<
  Omit<LiveseqProps, 'project'> & { project: Partial<SerializableProject> }
>;

export const createLiveseq = (props: PartialLiveseqProps = {}): Liveseq => {
  const { project, audioContext, lookAheadTime, scheduleInterval, ...callbacks } = getDefaultProps(
    props,
  );
  // TODO: consider moving inside createProject
  validateProject(project, errors);

  const store = createStore(project.initialState, callbacks);
  const entities = createEntities(project, audioContext);

  // TODO: better naming
  // separate function so we can make it part of the API (useful for testing as well)
  const getScheduleItems = (
    timeRange: TimeRange,
    previouslyScheduledNoteIds: Array<string> = [],
  ) => {
    const currentBpm = store.selectors.getTempo();
    const currentSlotPlaybackState = store.selectors.getSlotPlaybackState();
    const beatsRange = timeRangeToBeatsRange(timeRange, currentBpm);

    return getScheduleItemsWithinRange(
      beatsRange,
      entities,
      currentBpm,
      currentSlotPlaybackState,
      previouslyScheduledNoteIds,
    );
  };

  // TODO: better naming
  const getScheduleItemsInfo = (timeRange: TimeRange) => {
    return getScheduleItems(timeRange).scheduleItems.map((scheduleItem) => {
      return {
        notes: scheduleItem.notes,
        // TODO: add SerializableInstrument here as well
      };
    });
  };

  const player = createPlayer({
    getScheduleItems,
    onSchedule: ({ nextSlotPlaybackState }) => {
      store.actions.setSlotPlaybackState(nextSlotPlaybackState);
    },
    onPlay: store.actions.play,
    onStop: store.actions.stop,
    audioContext,
    lookAheadTime,
    scheduleInterval,
    errors,
  });

  const getProject = () => {
    // TODO: process the current state and
    return project;
  };

  const dispose = () => {
    player.dispose();
    store.dispose();
  };

  // liveseq's API
  return {
    getScheduleItemsInfo,
    play: player.play,
    stop: player.stop,
    setTempo: store.actions.setTempo,
    getTempo: store.selectors.getTempo,
    getIsPlaying: store.selectors.getIsPlaying,
    getProject,
    dispose,
    audioContext,
  };
};
