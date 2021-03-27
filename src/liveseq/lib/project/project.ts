import { isAny, isNumber, isString, shape } from 'isntnt';
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

export const isSerializableProject = shape({
  libraryVersion: isNumber,
  name: isString,
  // TODO: remove isAny
  initialState: isAny,
  entities: shape({
    channels: isAny, // TODO: remove isAny
    instruments: isAny,
    timelines: isAny,
    clips: isAny,
    scenes: isAny,
    samples: isAny,
    slots: isAny,
  }),
});

export const createProject = (project: Partial<SerializableProject> = {}): SerializableProject => {
  return {
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
};
