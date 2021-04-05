import type { PlayerState } from '../player/player';
import { libraryVersion } from '../meta';
import { createSlotPlaybackState } from '../scheduler/slotPlaybackState';
import { validateProject } from './validateProject';

import type { SerializableEntities } from '../entities/entities';

export type SerializableProject = {
  libraryVersion: number;
  name: string;
  initialState: Partial<PlayerState>;
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
      samples: [],
      slots: [],
      ...(project.entities || {}),
    },
  };

  validateProject(projectWithDefaults);

  return projectWithDefaults;
};
