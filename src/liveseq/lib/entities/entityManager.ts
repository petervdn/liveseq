import type { Entities } from './entities';
import { ClipManager, getClipManager } from './clip/clip';
import { getInstrumentManager, InstrumentManager } from './instrument/instrument';
import type { SceneManager } from './scene/scene';
import { getSlotManager, SlotManager } from './slot/slot';
import { getTimelineManager, TimelineManager } from './timeline/timeline';
import type { CommonProps, OmitId } from '../types';
import type { SampleManager } from './sample/sample';
import type { SerializableProject } from '../..';
import { createEntities } from './entities';
import { getIdGenerator } from '../utils/getIdGenerator';
import { getSceneManager } from './scene/scene';
import { getHighestId } from '../utils/getHighestId';
import { getSampleManager } from './sample/sample';
import { errorMessages } from '../errors';
import { enable } from '../utils/enable';
import { disable } from '../utils/disable';
import type { InstrumentChannelManager } from './instrumentChannel/instrumentChannel';
import { getInstrumentChannelManager } from './instrumentChannel/instrumentChannel';

export type AddEntity<Props> = (props: OmitId<Props & { id: string }>) => string;
export type RemoveEntity = (id: string) => void;

export type EntityManagerActions = InstrumentChannelManager &
  ClipManager &
  SceneManager &
  SlotManager &
  InstrumentManager &
  TimelineManager &
  SampleManager;

type EntityManager = {
  selectors: {
    getEntities: () => Entities;
  };
  actions: EntityManagerActions;
};

// passed to each entity manager
export type EntityManagementProps = {
  addEntity: <T extends CommonProps>(getEntity: (id: string) => T) => string;
  getEntities: () => Entities;
  removeEntity: (id: string) => void;
  updateEntity: <T>(id: string, update: (entity: T) => T) => void;
  enable: (id: string) => void;
  disable: (id: string) => void;
};

export const createEntityManager = (project: SerializableProject): EntityManager => {
  let currentEntities = createEntities(project);

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
      ...getClipManager(getProps('clips')),
      ...getSampleManager(getProps('samples')),
      ...getSceneManager(getProps('scenes')),
      ...getSlotManager(getProps('slots')),
      ...getInstrumentManager(getProps('instruments')),
      ...getTimelineManager(getProps('timelines')),
    },
    selectors: {
      getEntities,
    },
  };
};
