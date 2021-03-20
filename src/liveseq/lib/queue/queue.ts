import type { Beats } from '../time/time';
import type { BeatsRange } from '../time/beatsRange';
import type { SceneEntity } from '../entities/scene/scene';
import type { Entities } from '../entities/entities';

type PlayingSlot = {
  slotId: string;
  start: Beats;
};

type QueuedScene = BeatsRange & {
  sceneId: string;
};

type Queue = {
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
export const applyScene = (scene: SceneEntity, queue: Queue): Queue => {
  // TODO
  return {
    ...queue,
  };
};

// to know what a queue looks like in the future
export const getQueueAt = (time: Beats, queue: Queue): Queue => {
  // TODO: calculate the resulting Queue at the given time
  return {
    ...queue,
  };
};

// get the slots from queue at a given time
export const getSlotsAt = (time: Beats, entities: Entities, queue: Queue) => {
  const queueAtTime = getQueueAt(time, queue);

  return queueAtTime.playingSlots.map((playingSlot) => {
    return entities.slots[playingSlot.slotId];
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
