import { createStore, StoreActions } from './store/store';
import { createEntityManager, EntityManagerActions } from './entities/entityManager';
import type { TimeRange } from './time/timeRange';
import { timeRangeToBeatsRange } from './time/beatsRange';
import { getScheduleItemsWithinRange } from './player/slotPlaybackState';
import { createPlayer, PlayerActions, ScheduleNote } from './player/player';
import { serializeEntities } from './entities/entities';
import { createProject, SerializableProject } from './project/project';
import type { Bpm, TimeInSeconds } from './types';

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
  EntityManagerActions & {
    setProject: (partialProject: Partial<SerializableProject>) => void;
  };

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
  const entityManager = createEntityManager(project);

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
      entityManager.selectors.getEntities(),
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
    const serializableEntities = serializeEntities(entityManager.selectors.getEntities());
    const slotPlaybackState = store.selectors.getSlotPlaybackState();

    return createProject({
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

  // ACTIONS
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setProject = (partialProject: Partial<SerializableProject>) => {
    // TODO: implement
  };

  // CORE
  const dispose = () => {
    player.dispose();
    store.dispose();
  };

  return {
    // actions
    ...entityManager.actions,
    ...player.actions,
    setTempo: store.actions.setTempo,
    setIsMuted: store.actions.setIsMuted,
    addSceneToQueue: store.actions.addSceneToQueue,
    removeSceneFromQueue: store.actions.removeSceneFromQueue,
    setProject,
    // selectors
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
