import type { SerializableProject } from '../project/project';
import { createInstrumentChannelEntries, SerializableInstrumentChannel } from './instrumentChannel';
import { createNoteClipEntries, SerializableClip } from './noteClip';
import { createSamplerEntries, SerializableSampler } from './sampler';
import { createSceneEntries, SerializableScene } from './scene';
import { createSlotEntries, SerializableSlot } from './slot';
import { createTimelineEntries, SerializableTimeline } from './timeline';
import { objectEntries, objectValues } from '../../../core/utils/objUtils';

export type CreateEntitiesProps = {
  project: SerializableProject;
};

const decodeProjectEntities = (props: CreateEntitiesProps) => {
  const entries = {
    ...createInstrumentChannelEntries(),
    ...createNoteClipEntries(),
    ...createSamplerEntries(),
    ...createSceneEntries(),
    ...createSlotEntries(),
    ...createTimelineEntries(),
  };

  objectEntries(props.project.entities).forEach(([key, values]) => {
    values.forEach((value: unknown) => {
      entries[key as keyof typeof entries].create(value as never);
    });
  });

  return entries;
};

export type EntityEntries = ReturnType<typeof decodeProjectEntities>;

export type SerializableEntities = {
  instrumentChannels: Array<SerializableInstrumentChannel>;
  noteClips: Array<SerializableClip>;
  samplers: Array<SerializableSampler>;
  scenes: Array<SerializableScene>;
  slots: Array<SerializableSlot>;
  timelines: Array<SerializableTimeline>;
};

const encodeEntities = (entities: EntityEntries): SerializableEntities => {
  return objectEntries(entities).reduce((accumulator, [key, entity]) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    accumulator[key] = objectValues(entity.getRecord()).map(({ id }) => entities[key].encode(id));
    return accumulator;
  }, {} as SerializableEntities);
};

export const createEntities = (props: CreateEntitiesProps) => {
  const entities = decodeProjectEntities(props);

  return {
    getEntries: () => {
      return entities;
    },
    encodeEntities: () => {
      return encodeEntities(entities);
    },
    dispose: () => {
      objectValues(entities).forEach((entity) => entity.dispose());
    },
  };
};
