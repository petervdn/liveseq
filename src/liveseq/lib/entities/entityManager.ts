import type { Entities } from './entities';
import { ClipManager, getClipManager } from './clip/clip';
import { getInstrumentManager, InstrumentManager } from './instrument/instrument';
import type { SceneManager } from './scene/scene';
import { getSlotManager, SlotManager } from './slot/slot';
import { getTimelineManager, TimelineManager } from './timeline/timeline';
import type { OmitId } from '../types';
import type { SampleManager } from './sample/sample';
import type { SerializableProject } from '../..';
import { createEntities } from './entities';
import { getChannelManager } from './channel/channel';
import type { ChannelManager } from './channel/channel';
import { getIdGenerator } from '../utils/getIdGenerator';
import { getSceneManager } from './scene/scene';
import { getHighestId } from '../utils/getHighestId';
import { getSampleManager } from './sample/sample';

export type AddEntity<Props> = (props: OmitId<Props & { id: string }>) => string;
export type RemoveEntity = (id: string) => void;

export type EntityManagerActions = ChannelManager &
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
  addEntity: (getEntity: (id: string) => unknown) => string;
  getEntities: () => Entities;
  removeEntity: (id: string) => void;
};

export const createEntityManager = (project: SerializableProject): EntityManager => {
  let currentEntities = createEntities(project);

  const getEntities = () => {
    return currentEntities;
  };

  const setEntities = (entities: Entities) => {
    currentEntities = entities;
  };

  const getAddEntity = (key: keyof Entities) => {
    const generateId = getIdGenerator(key, getHighestId(Object.keys(getEntities()[key])));

    return (getEntity: (id: string) => unknown) => {
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

  const getProps = (key: keyof Entities) => {
    return {
      addEntity: getAddEntity(key),
      removeEntity: getRemoveEntity(key),
      getEntities,
    };
  };

  return {
    actions: {
      ...getChannelManager(getProps('channels')),
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
