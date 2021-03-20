import type { Beats } from '../time/time';
import type { BeatsRange } from '../time/beatsRange';
import type { SceneEntity } from '../entities/scene/scene';
import { createRange, isTimeInRange } from '../time/beatsRange';
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

export const applyScenesToQueue = (
  scenes: Array<Pick<SceneEntity, 'id' | 'isEnabled' | 'eventActions'>>,
  entities: Pick<Entities, 'slots'>,
  queue: Queue,
  start: Beats,
): Queue => {
  // TODO: consider isEnabled
  // TODO: incomplete implementation, only plays
  const playingSlots = scenes.flatMap((scene) => {
    const playSlotsActions = (scene.eventActions.enter || []).filter((action) => {
      return action.type === 'playSlots';
    });

    return playSlotsActions.flatMap((action) => {
      // if not specified we get all
      const slotIds = action.slotIds || Object.keys(entities.slots);

      return slotIds.map((id) => {
        return {
          slotId: id,
          start,
        };
      });
    });
  });

  const activeSceneIds = scenes.map((scene) => scene.id); // TODO: incomplete

  return {
    ...queue,
    playingSlots,
    activeSceneIds,
  };
};

// find the scenes that will get triggered in the beatsRange
export const getQueuedScenesWithinRange = (beatsRange: BeatsRange, queue: Queue) => {
  return queue.queuedScenes.filter((queuedScene) => {
    // TODO: maybe .start is not enough a check since it also has an end
    return isTimeInRange(queuedScene.start, beatsRange);
  });
};

// given a range and a queue, get an array of the queue looks like at the respective ranges
export const getQueuesWithinRange = (
  beatsRange: BeatsRange,
  queue: Queue,
  entities: Pick<Entities, 'scenes' | 'slots'>,
): Array<BeatsRange & Queue> => {
  // 1. find the scenes that will get triggered in the beatsRange
  const queuedScenes = getQueuedScenesWithinRange(beatsRange, queue);

  // 2. group queuedScenes by start
  const queuedScenesByStart = queuedScenes.reduce<Record<number, Array<QueuedScene>>>(
    (accumulator, current) => {
      const start = current.start as number;

      if (!('start' in accumulator)) {
        accumulator[start] = [];
      }

      accumulator[start].push(current);

      return accumulator;
    },
    // we need it to always contain the start as that is just the queue unmodified
    { [beatsRange.start]: [] },
  );

  // TODO: this depends on ordering of the object keys, make sure it is correct
  // 3. map the result of step 2 into an array of ranges and queues with the corresponding scenes applied
  return Object.entries(queuedScenesByStart).reduce<Array<BeatsRange & Queue>>(
    (accumulator, current, index, object) => {
      const [startKey, queuedScenes] = current;
      // TODO: this parseInt can probably be removed, just need to make sure casting the type is correct
      const start = parseInt(startKey, 10);

      // get from next item in object or the beatsRange.end
      const end = index <= object.length - 2 ? object[index + 1] : beatsRange.end;

      const sceneEntities = queuedScenes.map((scene) => {
        return entities.scenes[scene.sceneId];
      });

      // get queue from previous item in accumulator if there is one
      const currentQueue = index > 0 ? accumulator[index - 1] : queue;

      accumulator.push({
        ...applyScenesToQueue(sceneEntities, entities, currentQueue, start as Beats),
        ...createRange(start as Beats, end as Beats),
      });

      return accumulator;
    },
    [],
  );
};

export const getSlotsWithinRange = (beatsRange: BeatsRange, queue: Queue, entities: Entities) => {
  const queues = getQueuesWithinRange(beatsRange, queue, entities);

  return queues.map((queue) => {
    return {
      start: queue.start,
      end: queue.end,
      slots: queue.playingSlots,
    };
  });
};

export const addScenesToQueue = (scenes: Array<QueuedScene>, queue: Queue): Queue => {
  return {
    ...queue,
    queuedScenes: queue.queuedScenes.concat(scenes).sort((sceneA, sceneB) => {
      // eslint-disable-next-line no-nested-ternary
      return sceneA.start < sceneB.start ? -1 : sceneA.start > sceneB.start ? 1 : 0;
    }),
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
