import { libraryVersion } from '../../libraryVersion';
import type { Project } from './project';

export const getDefaultProject = (): Project => {
  return {
    libraryVersion,
    name: 'untitled',
    startScenes: [],
    entities: {
      channels: [],
      instruments: [],
      timelines: [],
      clips: [],
      scenes: [],
      samples: [],
      slots: [],
    },
  };
};
