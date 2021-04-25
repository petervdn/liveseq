/* eslint-disable no-console */
import { createProject, SerializableProject } from './project/project';
import { libraryVersion } from './meta';
import { createEntities } from './entities/entities';
import { createMixer } from '../../mixer/mixer';
import { createScheduler } from './scheduler/scheduler';
import { removeNonSerializableProps } from '../../../components/utils/removeNonSerializableProps';
import type { TimeInSeconds } from '../../time/types';
import { player } from '../../core/player';
import type { InputProps } from '../../core/getInputProps';

export type EngineProps = {
  project: SerializableProject;
  audioContext: AudioContext;
} & InputProps;

export type Engine = ReturnType<typeof createEngine>;

export const createEngine = ({
  project,
  audioContext,
  sources,
  getters,
  handlers,
}: EngineProps) => {
  const { sources: playerSources, getters: playerGetters } = player({
    getCurrentTime: () => audioContext.currentTime as TimeInSeconds,
    sources,
  });
  const { tempo$, beatsRange$ } = playerSources;

  const mixer = createMixer(audioContext);
  const entities = createEntities({
    project,
    mixer,
  });
  const entityEntries = entities.getEntries();
  const scheduler = createScheduler({
    entityEntries,
    beatsRange$,
    tempo$,
    initialState: project.initialState,
  });

  // SELECTORS
  const getAudioContext = () => {
    return audioContext;
  };

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

  // CORE
  const dispose = () => {
    scheduler.dispose();
    // player.dispose();
    entities.dispose();
  };

  return {
    // all entity types
    ...entities.getEntries(),
    // player
    ...handlers,
    ...getters,
    ...playerGetters,
    ...playerSources,
    onSchedule: scheduler.onSchedule,
    onPlayNote: scheduler.onPlayNote,
    setTempo: handlers.setTempo,
    addSceneToQueue: scheduler.addSceneToQueue,
    removeSceneFromQueue: scheduler.removeSceneFromQueue,
    getScheduleDataWithinRange: scheduler.getScheduleDataWithinRange,
    // core
    getProject,
    getAudioContext,
    dispose,
  };
};
