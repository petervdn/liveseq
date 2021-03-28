import type { LiveseqState } from '../store/store';
import { libraryVersion } from '../meta';
import { createSlotPlaybackState } from '../player/slotPlaybackState';
import { validateProject } from './validateProject';
import { errors } from '../errors';
import type { SerializableEntities } from '../entities/entities';

export type SerializableProject = {
  libraryVersion: number;
  name: string;
  initialState: Partial<LiveseqState>;
  entities: SerializableEntities;
};

export const createProject = (project: Partial<SerializableProject> = {}): SerializableProject => {
  const projectWithDefaults: SerializableProject = {
    libraryVersion,
    name: 'untitled',
    ...project,
    initialState: {
      slotPlaybackState: createSlotPlaybackState(),
      ...(project.initialState || {}),
    },
    entities: {
      channels: [],
      instruments: [],
      timelines: [],
      clips: [],
      scenes: [],
      samples: [],
      slots: [],
      ...(project.entities || {}),
    },
  };

  validateProject(projectWithDefaults, errors);

  return projectWithDefaults;
};
