import type { SerializableProject } from '../project/project';
import type { NoteClipEntity, SerializableClip } from './noteClip/noteClip';
import { createNoteClipEntity, getNoteClipManager } from './noteClip/noteClip';
import type { TimelineEntity } from './timeline/timeline';
import {
  createTimelineEntity,
  getTimelineManager,
  SerializableTimeline,
} from './timeline/timeline';
import {
  createSamplerEntity,
  getInstrumentManager,
  SamplerEntity,
  SerializableSampler,
} from './sampler/sampler';
import { createSlotEntity, getSlotManager, SerializableSlot, SlotEntity } from './slot/slot';
import type { SceneEntity } from './scene/scene';
import { createSceneEntity, getSceneManager, SerializableScene } from './scene/scene';
import { createRecordById } from '../utils/createRecordById';
import type { SampleEntity, SerializableSample } from './sample/sample';
import { createSampleEntity, getSampleManager } from './sample/sample';
import {
  createInstrumentChannelEntity,
  getInstrumentChannelManager,
  InstrumentChannelEntity,
  SerializableInstrumentChannel,
} from './instrumentChannel/instrumentChannel';
import { errorMessages } from '../errors';
import { getIdGenerator } from '../utils/getIdGenerator';
import { getHighestId } from '../utils/getHighestId';
import type { CommonProps } from '../types';
import { enable } from '../utils/enable';
import { disable } from '../utils/disable';
import type { EntityManagementProps } from './entityManager';

export type Entities = {
  instrumentChannels: Record<string, InstrumentChannelEntity>;
  noteClips: Record<string, NoteClipEntity>;
  samplers: Record<string, SamplerEntity>;
  samples: Record<string, SampleEntity>;
  scenes: Record<string, SceneEntity>;
  slots: Record<string, SlotEntity>;
  timelines: Record<string, TimelineEntity>;
};

export function createEntities(project: SerializableProject) {
  // TODO: create one way links between entities when initializing

  let currentEntities = {
    instrumentChannels: createRecordById(
      project.entities.instrumentChannels.map(createInstrumentChannelEntity),
    ),
    noteClips: createRecordById(project.entities.noteClips.map(createNoteClipEntity)),
    samplers: createRecordById(project.entities.samplers.map(createSamplerEntity)),
    samples: createRecordById(project.entities.samples.map(createSampleEntity)),
    scenes: createRecordById(project.entities.scenes.map(createSceneEntity)),
    slots: createRecordById(project.entities.slots.map(createSlotEntity)),
    timelines: createRecordById(project.entities.timelines.map(createTimelineEntity)),
  };

  const getEntityById = (key: keyof Entities, id: string) => {
    const entity = currentEntities[key][id];
    if (!entity) {
      throw new Error(errorMessages.invalidEntityId(key, id));
    }
    return entity;
  };

  const getEntities = () => {
    return currentEntities;
  };

  const setEntities = (entities: Entities) => {
    currentEntities = entities;
  };

  const getUpdateEntityById = (key: keyof Entities) => <T>(
    id: string,
    mapEntity: (entity: T) => T,
  ) => {
    const entity = getEntityById(key, id);
    const entities = getEntities();

    setEntities(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mapEntity({
        ...entities,
        [key]: {
          ...entities[key],
          [id]: entity,
        },
      }),
    );
  };

  const getAddEntity = (key: keyof Entities) => {
    const generateId = getIdGenerator(key, getHighestId(Object.keys(getEntities()[key])));

    return <T extends CommonProps>(getEntity: (id: string) => T) => {
      const id = generateId();
      const entity = getEntity(id);
      const entities = getEntities();
      setEntities({
        ...entities,
        [key]: {
          ...entities[key],
          [id]: entity,
        },
      });
      return id;
    };
  };

  const getRemoveEntity = (key: keyof Entities) => (id: string) => {
    const entities = getEntities();
    const copy = { ...entities[key] };
    // just to trigger an error in case the id doesn't exist
    getEntityById(key, id);
    delete copy[id];

    const result = {
      ...entities,
      [key]: {
        ...copy,
      },
    };

    // TODO: search and remove any references by id

    setEntities(result);
  };

  const getProps = (key: keyof Entities): EntityManagementProps => {
    const addEntity = getAddEntity(key);
    const removeEntity = getRemoveEntity(key);
    const updateEntity = getUpdateEntityById(key);

    return {
      addEntity,
      removeEntity,
      getEntities,
      updateEntity,
      enable: (id) => updateEntity<CommonProps>(id, enable),
      disable: (id) => updateEntity<CommonProps>(id, disable),
    };
  };

  return {
    actions: {
      ...getInstrumentChannelManager(getProps('instrumentChannels')),
      ...getNoteClipManager(getProps('noteClips')),
      ...getSampleManager(getProps('samples')),
      ...getSceneManager(getProps('scenes')),
      ...getSlotManager(getProps('slots')),
      ...getInstrumentManager(getProps('samplers')),
      ...getTimelineManager(getProps('timelines')),
    },
    selectors: {
      getEntities,
    },
  };
}

// Serialization
export type SerializableEntities = {
  instrumentChannels: Array<SerializableInstrumentChannel>;
  noteClips: Array<SerializableClip>;
  samplers: Array<SerializableSampler>;
  samples: Array<SerializableSample>;
  scenes: Array<SerializableScene>;
  slots: Array<SerializableSlot>;
  timelines: Array<SerializableTimeline>;
};

export const serializeEntities = (entities: Entities): SerializableEntities => {
  return {
    instrumentChannels: Object.values(entities.instrumentChannels),
    noteClips: Object.values(entities.noteClips),
    samplers: Object.values(entities.samplers).map((instrument) => {
      const { schedule, ...withoutSchedule } = instrument;
      return withoutSchedule;
    }),
    samples: [],
    scenes: Object.values(entities.scenes),
    slots: Object.values(entities.slots),
    timelines: Object.values(entities.timelines),
  };
};
