import { createPlayer } from './player/player';
import { createProject, SerializableProject } from './project/project';
import type { TimeInSeconds } from './types';
import { libraryVersion } from './meta';
import { createEntities } from './entities/entities';
import { createMixer } from './mixer/mixer';

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
  const player = createPlayer({
    audioContext,
    lookAheadTime,
    scheduleInterval,
    initialState: project.initialState,
    entities: entities.getEntries(),
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
    getScheduleItemsInfo: player.getScheduleItemsInfo,
    getSlotPlaybackStatesWithinRange: player.getSlotPlaybackStatesWithinRange,
    // core
    getProject,
    getAudioContext,
    dispose,
  };
};
