import { createStore } from './store/store';
import type { SerializableProject } from './project/project';
import { createEntities } from './entities/entities';
import { getScheduleItemsWithinRange } from './player/slotPlaybackState';
import { timeRangeToBeatsRange } from './time/beatsRange';
import type { TimeRange } from './time/timeRange';
import { createPlayer, PlayerActions, ScheduleNote } from './player/player';
import { getDefaultProps } from './utils/getDefaultProps';
import { createEntityManager, EntityManagerActions } from './entities/entityManager';
import type { Bpm, TimeInSeconds } from './types';

export type CommonProps = {
  id: string;
  name?: string;
  isEnabled?: boolean;
};

export type LiveseqCallbacks = {
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onTempoChange: () => void;
};

export type LiveseqProps = LiveseqCallbacks & {
  project: SerializableProject;
  audioContext: AudioContext;
  lookAheadTime: TimeInSeconds;
  scheduleInterval: TimeInSeconds;
};

export type LiveseqActions = PlayerActions &
  EntityManagerActions & {
    setTempo: (bpm: Bpm) => void;
  };

// TODO: do similar to LiveseqActions
export type LiveseqSelectors = {
  getTempo: () => Bpm;
  getScheduleItemsInfo: (timeRange: TimeRange) => Array<{ notes: Array<ScheduleNote> }>;
  getIsPlaying: () => boolean;
  getIsPaused: () => boolean;
  getIsStopped: () => boolean;
  getProject: () => SerializableProject;
  getAudioContext: () => AudioContext;
};

// for now it's flat, maybe could use the same pattern as used internally of having actions and selectors in their own keys
export type Liveseq = LiveseqActions &
  LiveseqSelectors & {
    dispose: () => void;
  };

export type PartialLiveseqProps = Partial<
  Omit<LiveseqProps, 'project'> & { project: Partial<SerializableProject> }
>;

export const createLiveseq = (props: PartialLiveseqProps = {}): Liveseq => {
  const { project, audioContext, lookAheadTime, scheduleInterval, ...callbacks } = getDefaultProps(
    props,
  );

  const store = createStore(project.initialState, callbacks);
  const entityManager = createEntityManager(createEntities(project, audioContext));

  // TODO: better naming
  // separate function so we can use for getScheduleItemsInfo below as it's part of the API
  const getScheduleItems = (
    timeRange: TimeRange,
    previouslyScheduledNoteIds: Array<string> = [],
  ) => {
    const currentBpm = store.selectors.getTempo();
    const currentSlotPlaybackState = store.selectors.getSlotPlaybackState();
    const beatsRange = timeRangeToBeatsRange(timeRange, currentBpm);

    return getScheduleItemsWithinRange(
      beatsRange,
      entityManager.selectors.getEntities(),
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
    onPause: store.actions.pause,
    audioContext,
    lookAheadTime,
    scheduleInterval,
  });

  const getProject = () => {
    // TODO: generate from entities and current state
    return project;
  };

  const getAudioContext = () => {
    return audioContext;
  };

  const dispose = () => {
    player.dispose();
    store.dispose();
  };

  return {
    // actions
    ...entityManager.actions,
    ...player.actions,
    setTempo: store.actions.setTempo,
    // selectors
    getScheduleItemsInfo,
    getTempo: store.selectors.getTempo,
    getIsPlaying: store.selectors.getIsPlaying,
    getIsPaused: store.selectors.getIsPaused,
    getIsStopped: store.selectors.getIsStopped,
    getProject,
    getAudioContext,
    // core
    dispose,
  };
};
