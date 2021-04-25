import { libraryVersion } from '../meta';
import { validateProject } from './validateProject';
import type { SerializableEntities } from '../entities/entities';
import type { SchedulerState } from '../scheduler/schedulerState';
import { createSlotPlaybackState } from '../scheduler/schedulerState';
import type { Bpm } from '../../../time/types';
import type { Playback } from '../../../core/streams/playback';

export type PlayerState = {
  playbackState: Playback;
  tempo: Bpm;
};

export type SerializableProject = {
  libraryVersion: number;
  name: string;
  initialState: Partial<PlayerState & SchedulerState>;
  entities: SerializableEntities;
};

export const defaultProjectName = 'untitled';

export const createProject = (project: Partial<SerializableProject> = {}): SerializableProject => {
  const projectWithDefaults: SerializableProject = {
    libraryVersion,
    name: defaultProjectName,
    ...project,
    initialState: {
      slotPlaybackState: createSlotPlaybackState(),
      ...(project.initialState || {}),
    },
    entities: {
      instrumentChannels: [],
      samplers: [],
      timelines: [],
      noteClips: [],
      scenes: [],
      slots: [],
      ...(project.entities || {}),
    },
  };

  validateProject(projectWithDefaults);

  return projectWithDefaults;
};
