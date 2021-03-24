import { libraryVersion } from '../../libraryVersion';
import type { SerializableProject } from './project';
import { createSlotPlaybackState } from '../player/slotPlaybackState';

export const getDefaultProject = (): SerializableProject => {
  return {
    libraryVersion,
    name: 'untitled',
    initialState: {
      slotPlaybackState: createSlotPlaybackState(),
    },
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
