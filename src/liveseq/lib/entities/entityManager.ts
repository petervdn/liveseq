import type { Entities } from './entities';
import { addChannel, removeChannel, SerializableChannel } from './channel/channel';
import { addClip, removeClip, SerializableClip } from './clip/clip';
import { addInstrument, removeInstrument, SerializableInstrument } from './instrument/instrument';
import { addScene, removeScene, SerializableScene } from './scene/scene';
import { addSlot, removeSlot, SerializableSlot } from './slot/slot';
import { addTimeline, removeTimeline, SerializableTimeline } from './timeline/timeline';
import { getIdGenerators } from './getIdGenerators';
import type { OmitId } from '../types';
import type { SerializableSample } from './sample/sample';

type AddEntity<Props> = (props: OmitId<Props & { id: string }>) => void;
type RemoveEntity = (id: string) => void;

// use literal string types for the keys
export type EntityManagerActions = {
  addChannel: AddEntity<SerializableChannel>;
  removeChannel: RemoveEntity;

  addClip: AddEntity<SerializableClip>;
  removeClip: RemoveEntity;

  addInstrument: AddEntity<SerializableInstrument>;
  removeInstrument: RemoveEntity;

  addSample: AddEntity<SerializableSample>;
  removeSample: RemoveEntity;

  addScene: AddEntity<SerializableScene>;
  removeScene: RemoveEntity;

  addSlot: AddEntity<SerializableSlot>;
  removeSlot: RemoveEntity;

  addTimeline: AddEntity<SerializableTimeline>;
  removeTimeline: RemoveEntity;
};

type EntityManager = {
  selectors: {
    getEntities: () => Entities;
  };
  actions: EntityManagerActions;
};

export const createEntityManager = (entities: Entities): EntityManager => {
  let currentEntities = entities;
  const idGenerators = getIdGenerators(entities);

  return {
    actions: {
      addChannel: (channel) => {
        currentEntities = addChannel(currentEntities, channel, idGenerators.getChannelId);
      },
      removeChannel: (id) => {
        currentEntities = removeChannel(currentEntities, id);
      },
      addClip: (channel) => {
        currentEntities = addClip(currentEntities, channel, idGenerators.getChannelId);
      },
      removeClip: (id) => {
        currentEntities = removeClip(currentEntities, id);
      },
      addInstrument: (instrument) => {
        currentEntities = addInstrument(currentEntities, instrument, idGenerators.getInstrumentId);
      },
      removeInstrument: (id) => {
        currentEntities = removeInstrument(currentEntities, id);
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      addSample: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      removeSample: () => {},
      addScene: (scene) => {
        currentEntities = addScene(currentEntities, scene, idGenerators.getSceneId);
      },
      removeScene: (id) => {
        currentEntities = removeScene(currentEntities, id);
      },
      addSlot: (slot) => {
        currentEntities = addSlot(currentEntities, slot, idGenerators.getSlotId);
      },
      removeSlot: (id) => {
        currentEntities = removeSlot(currentEntities, id);
      },
      addTimeline: (timeline) => {
        currentEntities = addTimeline(currentEntities, timeline, idGenerators.getTimelineId);
      },
      removeTimeline: (id) => {
        currentEntities = removeTimeline(currentEntities, id);
      },
    },
    selectors: {
      getEntities: () => {
        return currentEntities;
      },
    },
  };
};
