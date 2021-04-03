import { createPlayer } from './player/player';
import type { TimeRange } from './time/timeRange';
import { BeatsRange, timeRangeToBeatsRange } from './time/beatsRange';
import { createProject, SerializableProject } from './project/project';
import type { Bpm, TimeInSeconds } from './types';
import { libraryVersion } from './meta';
import { createEntities } from './entities/entities';
import { getScheduleItemsWithinRange } from './player/utils/getScheduleItemsWithinRange';
import { getSlotPlaybackStatesWithinRange } from './player/utils/getSlotPlaybackStatesWithinRange';
import { createMixer } from './mixer/mixer';
import type { SlotPlaybackState } from './player/slotPlaybackState';

export type EngineProps = {
  project: SerializableProject;
  audioContext: AudioContext;
  lookAheadTime: TimeInSeconds;
  scheduleInterval: TimeInSeconds;
};

export type Engine = ReturnType<typeof createEngine>;

export const createEngine = ({
  project,
  audioContext,
  lookAheadTime,
  scheduleInterval,
}: EngineProps) => {
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
    currentBpm: Bpm,
    currentSlotPlaybackState: SlotPlaybackState,
  ) => {
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
    audioContext,
    lookAheadTime,
    scheduleInterval,
    initialState: project.initialState,
  });

  // SELECTORS
  const getProject = () => {
    const serializableEntities = entities.encodeEntities();
    const slotPlaybackState = player.getSlotPlaybackState();

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
    return getScheduleItems(
      timeRange,
      [],
      player.getTempo(),
      player.getSlotPlaybackState(),
    ).scheduleItems.flatMap((scheduleItem) => {
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
  };

  return {
    // all entity types
    ...entities.getEntries(),
    // player
    play: player.play,
    pause: player.pause,
    stop: player.stop,
    getPlaybackState: player.getPlaybackState,
    onPlaybackChange: player.onPlaybackChange,
    onTempoChange: player.onTempoChange,
    onSchedule: player.onSchedule,
    setTempo: player.setTempo,
    setIsMuted: player.setIsMuted,
    addSceneToQueue: player.addSceneToQueue,
    removeSceneFromQueue: player.removeSceneFromQueue,
    getTempo: player.getTempo,
    getIsPlaying: player.getIsPlaying,
    getIsPaused: player.getIsPaused,
    getIsStopped: player.getIsStopped,
    getIsMuted: player.getIsMuted,
    getScheduleItemsInfo,
    // TODO: move out of here
    getSlotPlaybackStatesWithinRange: (beatsRange: BeatsRange) => {
      return getSlotPlaybackStatesWithinRange(
        beatsRange,
        entities.getEntries(),
        player.getSlotPlaybackState(),
      );
    },
    // core
    getProject,
    getAudioContext,
    dispose,
  };
};
