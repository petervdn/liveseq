import { createStore, PlaybackStates } from './player/store';
import type { TimeRange } from './time/timeRange';
import { BeatsRange, timeRangeToBeatsRange } from './time/beatsRange';
import { createPlayer } from './player/player';
import { createProject, SerializableProject } from './project/project';
import type { Bpm, TimeInSeconds } from './types';
import { libraryVersion } from './meta';
import { createEntities } from './entities/entities';
import { getScheduleItemsWithinRange } from './player/utils/getScheduleItemsWithinRange';
import { getSlotPlaybackStatesWithinRange } from './player/utils/getSlotPlaybackStatesWithinRange';
import { createMixer } from './mixer/mixer';
import { createPubSub } from './utils/pubSub';
import { objectValues } from './utils/objUtils';

type ScheduleData = ReturnType<typeof getScheduleItemsWithinRange>;

export type EngineProps = {
  project: SerializableProject;
  audioContext: AudioContext;
  lookAheadTime: TimeInSeconds;
  scheduleInterval: TimeInSeconds;
};

export type Engine = ReturnType<typeof createEngine>;

export type EngineEvents = ReturnType<typeof createEngineEvents>;

const createEngineEvents = () => {
  const events = {
    playbackChange: createPubSub<PlaybackStates>(),
    tempoChange: createPubSub<Bpm>(),
    onSchedule: createPubSub<ScheduleData>(),
  };
  return events;
};

export const createEngine = ({
  project,
  audioContext,
  lookAheadTime,
  scheduleInterval,
}: EngineProps) => {
  const engineEvents = createEngineEvents();
  const store = createStore(project.initialState, engineEvents);
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
      engineEvents.onSchedule.dispatch(info);
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
    // TODO: allow simulating player by looping to make sure it is correct
    return getScheduleItems(timeRange).scheduleItems.flatMap((scheduleItem) => {
      return scheduleItem.notes.map((note) => {
        return {
          ...note,
          ...scheduleItem.instrument,
        };
      });
    });
  };

  // CORE
  const dispose = () => {
    player.dispose();
    store.dispose();

    objectValues(engineEvents).forEach((pubSub) => pubSub.dispose());
  };

  return {
    // actions
    ...entities.getEntries(),
    ...player.actions,
    subscribe: {
      playbackChange: engineEvents.playbackChange.subscribe,
      tempoChange: engineEvents.tempoChange.subscribe,
      schedule: engineEvents.onSchedule.subscribe,
    },
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
