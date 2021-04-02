import type { LiveseqState } from '../store/store';
import { libraryVersion } from '../meta';
import { createSlotPlaybackState } from '../player/slotPlaybackState';
import { validateProject } from './validateProject';

import type { SerializableEntities } from '../entities/entities';

export type SerializableProject = {
  libraryVersion: number;
  name: string;
  initialState: Partial<LiveseqState>;
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
      instruments: [],
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
