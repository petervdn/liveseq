import type { SerializableChannel } from '../entities/channel/channel';
import type { SerializableInstrument } from '../entities/instrument/instrument';
import type { SerializableTimeline } from '../entities/timeline/timeline';
import type { SerializableClip } from '../entities/clip/clip';
import type { SerializableSlot } from '../entities/slot/slot';
import type { SerializableScene } from '../entities/scene/scene';
import type { SerializableSample } from '../entities/sample/sample';
import type { LiveseqState } from '../store/store';
import { libraryVersion } from '../meta';
import { createSlotPlaybackState } from '../player/slotPlaybackState';
import { validateProject } from './validateProject';
import { errors } from '../errors';

export type SerializableProject = {
  libraryVersion: number;
  name: string;
  initialState: Partial<LiveseqState>;
  entities: {
    channels: Array<SerializableChannel>;
    instruments: Array<SerializableInstrument>;
    timelines: Array<SerializableTimeline>;
    clips: Array<SerializableClip>;
    scenes: Array<SerializableScene>;
    slots: Array<SerializableSlot>;
    samples: Array<SerializableSample>;
  };
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
