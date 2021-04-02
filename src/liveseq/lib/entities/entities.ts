import type { SerializableProject } from '../project/project';
import { createInstrumentChannelEntries, SerializableInstrumentChannel } from './instrumentChannel';
import { createNoteClipEntries, SerializableClip } from './noteClip';
import { createSampleEntries, SerializableSample } from './sample';
import { createSamplerEntries, SerializableSampler } from './sampler';
import { createSceneEntries, SerializableScene } from './scene';
import { createSlotEntries, SerializableSlot } from './slot';
import { createTimelineEntries, SerializableTimeline } from './timeline';
import { objectEntries, objectValues } from '../utils/objUtils';

const decodeProjectEntities = (project: SerializableProject) => {
  const entries = {
    ...createInstrumentChannelEntries(),
    ...createNoteClipEntries(),
    ...createSampleEntries(),
    ...createSamplerEntries(),
    ...createSceneEntries(),
    ...createSlotEntries(),
    ...createTimelineEntries(),
  };

  objectEntries(project.entities).forEach(([key, values]) => {
    values.forEach((value) => {
      entries[key as keyof typeof entries].create(value as never);
    });
  });

  return entries;
};

export type Entities = ReturnType<typeof decodeProjectEntities>;

export type SerializableEntities = {
  instrumentChannels: Array<SerializableInstrumentChannel>;
  noteClips: Array<SerializableClip>;
  samplers: Array<SerializableSampler>;
  samples: Array<SerializableSample>;
  scenes: Array<SerializableScene>;
  slots: Array<SerializableSlot>;
  timelines: Array<SerializableTimeline>;
};

const encodeEntities = (entities: Entities): SerializableEntities => {
  return objectEntries(entities).reduce((accumulator, [key, entity]) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    accumulator[key] = objectValues(entity.getRecord()).map(({ id }) => entities[key].encode(id));
    return accumulator;
  }, {} as SerializableEntities);
};

export const createEntities = (project: SerializableProject) => {
  const entries = decodeProjectEntities(project);

  return {
    getEntries: () => {
      return entries;
    },
    encodeEntities: () => {
      return encodeEntities(entries);
    },
  };
};
