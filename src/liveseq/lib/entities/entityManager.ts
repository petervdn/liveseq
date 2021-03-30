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
import type { SerializableProject } from '../..';
import { createEntities } from './entities';
import type { Note } from '../note/note';
import { createNote } from '../note/note';

type AddEntity<Props> = (props: OmitId<Props & { id: string }>) => string;
type RemoveEntity = (id: string) => void;

// use literal string types for the keys
export type EntityManagerActions = {
  addChannel: AddEntity<SerializableChannel>;
  removeChannel: RemoveEntity;

  addClip: AddEntity<SerializableClip>;
  removeClip: RemoveEntity;
  addNotesToClip: (clip: string, notes: Array<Partial<OmitId<Note>>>) => void;

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

export const createEntityManager = (project: SerializableProject): EntityManager => {
  let currentEntities = createEntities(project);
  const idGenerators = getIdGenerators(currentEntities);

  // TODO: see if we can DRY this
  return {
    actions: {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      addSample: () => {
        // TODO:
        return idGenerators.getSampleId();
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      removeSample: () => {
        // TODO:
      },
      addChannel: (channel) => {
        const id = idGenerators.getChannelId();
        currentEntities = addChannel(currentEntities, channel, id);
        return id;
      },
      removeChannel: (id) => {
        currentEntities = removeChannel(currentEntities, id);
      },
      // CLIP
      addClip: (channel) => {
        const id = idGenerators.getClipId();
        currentEntities = addClip(currentEntities, channel, id);
        return id;
      },
      removeClip: (id) => {
        currentEntities = removeClip(currentEntities, id);
      },
      addNotesToClip: (clipId, notes) => {
        const clip = currentEntities.clips[clipId];
        // mutation!
        clip.notes = clip.notes.concat(
          notes.map((note) => createNote({ ...note, id: idGenerators.getNoteId() })),
        );
      },
      // INSTRUMENT
      addInstrument: (instrument) => {
        const id = idGenerators.getInstrumentId();
        currentEntities = addInstrument(currentEntities, instrument, id);
        return id;
      },
      removeInstrument: (id) => {
        currentEntities = removeInstrument(currentEntities, id);
      },
      addScene: (scene) => {
        const id = idGenerators.getSceneId();
        currentEntities = addScene(currentEntities, scene, id);
        return id;
      },
      removeScene: (id) => {
        currentEntities = removeScene(currentEntities, id);
      },
      addSlot: (slot) => {
        const id = idGenerators.getSlotId();
        currentEntities = addSlot(currentEntities, slot, id);
        return id;
      },
      removeSlot: (id) => {
        currentEntities = removeSlot(currentEntities, id);
      },
      addTimeline: (timeline) => {
        const id = idGenerators.getTimelineId();
        currentEntities = addTimeline(currentEntities, timeline, id);
        return id;
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
