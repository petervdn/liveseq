import type { Beats } from '../time/time';
import type { BeatsRange } from '../time/beatsRange';
import type { Entities } from '../entities/entities';

type PlayingSlot = {
  slotId: string;
  start: Beats;
};

type QueuedScene = BeatsRange & {
  sceneId: string;
};

export type Queue = {
  playingSlots: Array<PlayingSlot>;
  activeSceneIds: Array<string>;
  queuedScenes: Array<QueuedScene>;
};

export const createQueue = (): Queue => {
  const defaultQueue = {
    playingSlots: [],
    activeSceneIds: [],
    queuedScenes: [],
  };

  return {
    ...defaultQueue,
    // TODO
  };
};

// get the resulting queue from immediately activating the given scene
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const applyScenesToQueue = (
  sceneIds: Array<string>,
  entities: Entities,
  queue: Queue,
): Queue => {
  // TODO
  return {
    ...queue,
  };
};

// given a range and a queue, get an array of the queue looks like at the respective ranges
export const getQueuesAtRange = (
  beatsRange: BeatsRange,
  queue: Queue,
): Array<BeatsRange & Queue> => {
  // TODO: calculate the resulting Queues at the given range
  return [
    {
      ...beatsRange,
      ...queue,
    },
  ];
};

export const getSlotsAtRange = (beatsRange: BeatsRange, entities: Entities, queue: Queue) => {
  const queues = getQueuesAtRange(beatsRange, queue);

  return queues.map((queue) => {
    return {
      start: queue.start,
      end: queue.end,
      slots: queue.playingSlots.map((playingSlot) => {
        return entities.slots[playingSlot.slotId];
      }),
    };
  });
};

export const addScenesToQueue = (scenes: Array<QueuedScene>, queue: Queue): Queue => {
  return {
    ...queue,
    queuedScenes: queue.queuedScenes.concat(scenes),
  };
};

const isSameQueuedScene = (queuedSceneA: QueuedScene, queuedSceneB: QueuedScene) => {
  return queuedSceneA.sceneId === queuedSceneB.sceneId && queuedSceneA.start === queuedSceneB.start;
};

export const removeScenesFromQueue = (scenes: Array<QueuedScene>, queue: Queue): Queue => {
  return {
    ...queue,
    queuedScenes: queue.queuedScenes.filter((queuedSceneA) => {
      return !scenes.find((queuedSceneB) => isSameQueuedScene(queuedSceneA, queuedSceneB));
    }),
  };
};
