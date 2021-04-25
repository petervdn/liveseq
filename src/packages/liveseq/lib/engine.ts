/* eslint-disable no-console */
import { subscribe } from 'callbag-common';
import { createPlayer } from './player/player';
import { createProject, SerializableProject } from './project/project';
import { libraryVersion } from './meta';
import { createEntities } from './entities/entities';
import { createMixer } from './mixer/mixer';
import { createScheduler } from './scheduler/scheduler';
import { removeNonSerializableProps } from '../../../components/utils/removeNonSerializableProps';
import type { TimeInSeconds } from '../../time/types';
import { getSetupSourcesWithHandlers, setup } from '../../core/setup';

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
    player.dispose();
    entities.dispose();
  };

  // TODO: this will replace the player and scheduler as streams are a better model
  const { sources, handlers } = getSetupSourcesWithHandlers();
  const getCurrentTime = () => audioContext.currentTime as TimeInSeconds;
  const {
    playback$,
    playStartTime$,
    elapsedTime$,
    interval$,
    isPlaying$,
    timeRange$,
    beatsRange$,
  } = setup({
    getCurrentTime,
    sources,
  });
  subscribe((x) => console.log('interval$', x))(interval$);
  subscribe((x) => console.log('playback$', x))(playback$);
  subscribe((x) => console.log('elapsedTime$', x))(elapsedTime$);
  subscribe((x) => console.log('isPlaying$', x))(isPlaying$);
  subscribe((x) => console.log('playStartTime$', x))(playStartTime$);
  subscribe((x) => console.log('timeRange$', x))(timeRange$);
  subscribe((x) => console.log('beatsRange$', x))(beatsRange$);

  // TODO: export everything here with spread and select what we want to expose in createLiveseq
  return {
    // all entity types
    ...entities.getEntries(),
    // player
    play: () => {
      player.play();
      // console.log('play');
      handlers.play();
    },
    pause: () => {
      player.pause();
      // console.log('pause');
      handlers.pause();
    },
    stop: () => {
      player.stop();
      // console.log('stop');
      handlers.stop();
    },
    getProgressInSeconds: player.getProgressInSeconds,
    getProgressInBeats: player.getProgressInBeats,
    getPlaybackState: player.getPlaybackState,
    onPlaybackChange: player.onPlaybackChange,
    onTempoChange: player.onTempoChange,
    onSchedule: scheduler.onSchedule,
    onPlayNote: scheduler.onPlayNote,
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
