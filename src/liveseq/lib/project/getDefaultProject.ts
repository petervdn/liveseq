import { libraryVersion } from '../../libraryVersion';
import type { SerializableProject } from './project';

export const getDefaultProject = (): SerializableProject => {
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
