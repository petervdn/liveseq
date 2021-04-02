import { createStore, StoreActions } from './store/store';
import type { TimeRange } from './time/timeRange';
import { BeatsRange, timeRangeToBeatsRange } from './time/beatsRange';
import { createPlayer, PlayerActions, ScheduleNote } from './player/player';
import { createProject, SerializableProject } from './project/project';
import type { Bpm, TimeInSeconds } from './types';
import { libraryVersion } from './meta';
import { createEntities, Entities } from './entities/entities';
import { getScheduleItemsWithinRange } from './player/utils/getScheduleItemsWithinRange';
import { getSlotPlaybackStatesWithinRange } from './player/utils/getSlotPlaybackStatesWithinRange';
import { createMixer } from './mixer/mixer';

export type EngineCallbacks = {
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onTempoChange: () => void;
  onSchedule: (info: ReturnType<typeof getScheduleItemsWithinRange>) => void;
};

export type EngineProps = EngineCallbacks & {
  project: SerializableProject;
  audioContext: AudioContext;
  lookAheadTime: TimeInSeconds;
  scheduleInterval: TimeInSeconds;
};

export type EngineActions = PlayerActions &
  Pick<StoreActions, 'setIsMuted' | 'setTempo' | 'addSceneToQueue' | 'removeSceneFromQueue'> &
  Entities;

// TODO: do similar to EngineActions
export type EngineSelectors = {
  getTempo: () => Bpm;
  getScheduleItemsInfo: (timeRange: TimeRange) => Array<{ notes: Array<ScheduleNote> }>;
  getIsPlaying: () => boolean;
  getIsPaused: () => boolean;
  getIsStopped: () => boolean;
  getProject: () => SerializableProject;
  getAudioContext: () => AudioContext;
  getIsMuted: () => void;
  getSlotPlaybackStatesWithinRange: (
    beatsRange: BeatsRange,
  ) => ReturnType<typeof getSlotPlaybackStatesWithinRange>;
};

// for now it's flat, maybe could use the same pattern as used internally of having actions and selectors in their own keys
export type Engine = EngineActions &
  EngineSelectors & {
    dispose: () => void;
  };

export const createEngine = ({
  project,
  audioContext,
  lookAheadTime,
  scheduleInterval,
  ...callbacks
}: EngineProps): Engine => {
  const store = createStore(project.initialState, callbacks);
  const mixer = createMixer(audioContext);
  const entities = createEntities({
    project,
    mixer,
  });

  // UTILS
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
      entities.getEntries(),
      currentBpm,
      currentSlotPlaybackState,
      previouslyScheduledNoteIds,
    );
  };

  const player = createPlayer({
    getScheduleItems,
    onSchedule: (info) => {
      store.actions.setSlotPlaybackState(info.nextSlotPlaybackState);
      callbacks.onSchedule(info);
    },
    onPlay: () => store.actions.setPlaybackState('playing'),
    onPause: () => store.actions.setPlaybackState('paused'),
    onStop: () => store.actions.setPlaybackState('stopped'),
    audioContext,
    lookAheadTime,
    scheduleInterval,
  });

  // SELECTORS
  const getProject = () => {
    const serializableEntities = entities.encodeEntities();
    const slotPlaybackState = store.selectors.getSlotPlaybackState();

    return createProject({
      ...project,
      libraryVersion,
      initialState: { slotPlaybackState },
      entities: serializableEntities,
    });
  };

  const getAudioContext = () => {
    return audioContext;
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

  // CORE
  const dispose = () => {
    player.dispose();
    store.dispose();
  };

  return {
    // actions
    ...entities.getEntries(),
    ...player.actions,
    setTempo: store.actions.setTempo,
    setIsMuted: store.actions.setIsMuted,
    addSceneToQueue: store.actions.addSceneToQueue,
    removeSceneFromQueue: store.actions.removeSceneFromQueue,
    // selectors
    getSlotPlaybackStatesWithinRange: (beatsRange: BeatsRange) => {
      return getSlotPlaybackStatesWithinRange(
        beatsRange,
        entities.getEntries(),
        store.selectors.getSlotPlaybackState(),
      );
    },
    getScheduleItemsInfo,
    getTempo: store.selectors.getTempo,
    getIsPlaying: store.selectors.getIsPlaying,
    getIsPaused: store.selectors.getIsPaused,
    getIsStopped: store.selectors.getIsStopped,
    getIsMuted: store.selectors.getIsMuted,
    getProject,
    getAudioContext,
    // core
    dispose,
  };
};
