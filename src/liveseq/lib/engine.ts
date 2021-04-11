import { createPlayer } from './player/player';
import { createProject, SerializableProject } from './project/project';
import type { TimeInSeconds } from './types';
import { libraryVersion } from './meta';
import { createEntities } from './entities/entities';
import { createMixer } from './mixer/mixer';
import { createScheduler } from './scheduler/scheduler';
import { removeNonSerializableProps } from '../../components/utils/removeNonSerializableProps';

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
  const entityEntries = entities.getEntries();
  const scheduler = createScheduler({
    entityEntries,
    initialState: project.initialState,
  });
  const player = createPlayer({
    scheduler,
    audioContext,
    lookAheadTime,
    scheduleInterval,
    initialState: project.initialState,
  });

  // SELECTORS
  const getProject = () => {
    const serializableEntities = entities.encodeEntities();
    const slotPlaybackState = scheduler.getSlotPlaybackState();

    return removeNonSerializableProps<SerializableProject>(
      createProject({
        ...project,
        libraryVersion,
        initialState: { slotPlaybackState },
        entities: serializableEntities,
      }),
    );
  };

  const getAudioContext = () => {
    return audioContext;
  };

  // CORE
  const dispose = () => {
    scheduler.dispose();
    player.dispose();
    entities.dispose();
  };

  // TODO: export everything here with spread and select what we want to expose in createLiveseq
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
    onSchedule: scheduler.onSchedule,
    setTempo: player.setTempo,
    addSceneToQueue: scheduler.addSceneToQueue,
    removeSceneFromQueue: scheduler.removeSceneFromQueue,
    getTempo: player.getTempo,
    getScheduleDataWithinRange: scheduler.getScheduleDataWithinRange,
    // core
    getProject,
    getAudioContext,
    dispose,
  };
};
