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

export const applyScenesToQueue = (
  scenes: Array<Pick<SceneEntity, 'id' | 'isEnabled' | 'eventActions'>>,
  entities: Pick<Entities, 'slots'>,
  queue: Queue,
  start: Beats,
): Queue => {
  // TODO: consider isEnabled
  // TODO: incomplete implementation, only plays
  const appliedScenes = scenes.flatMap((scene) => {
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

  const playingSlots = queue.playingSlots.concat(appliedScenes);

  const activeSceneIds = scenes.map((scene) => scene.id); // TODO: incomplete

  return {
    ...queue,
    playingSlots,
    activeSceneIds,
  };
};

// find the scenes that will get triggered in the beatsRange
export const getQueuedScenesWithinRange = (
  beatsRange: BeatsRange,
  queue: Queue,
): Array<QueuedScene> => {
  return queue.queuedScenes.filter((queuedScene) => {
    // TODO: maybe .start is not enough a check since it also has an end
    return isTimeInRange(queuedScene.start, beatsRange);
  });
};

// given a range and a queue, get an array of the queue looks like at the respective ranges
export const getQueuesWithinRange = (
  beatsRange: BeatsRange,
  entities: Pick<Entities, 'scenes' | 'slots'>,
  queue: Queue,
): Array<BeatsRange & Queue> => {
  // 1. find the scenes that will get triggered within the beatsRange
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

  // 3. map the result of step 2 into an array of queues with ranges and the corresponding scenes applied
  // this depends on ordering of the object keys, but they are already sorted when added since we probably read way more than write
  // TODO: ^ make sure the order is correct
  return Object.entries(queuedScenesByStart)
    .map(([key, value]) => {
      // TODO: see if we can remove this parseInt
      return [parseInt(key, 10), value] as const;
    })
    .reduce<Array<BeatsRange & Queue>>((accumulator, current, index, entries) => {
      const [start, queuedScenes] = current;

      // get from next entry's start, or beatsRange.end
      const end = index <= entries.length - 2 ? entries[index + 1][0] : beatsRange.end;

      // get queue from previous item in accumulator if there is one
      const currentQueue = index > 0 ? accumulator[index - 1] : queue;

      const sceneEntities = queuedScenes.map((scene) => {
        return entities.scenes[scene.sceneId];
      });

      const appliedQueue = {
        ...removeScenesFromQueue(
          queuedScenes,
          applyScenesToQueue(sceneEntities, entities, currentQueue, start as Beats),
        ),
        ...createRange(start as Beats, end as Beats),
      };

      accumulator.push(appliedQueue);

      return accumulator;
    }, []);
};

export const getSlotsWithinRange = (
  beatsRange: BeatsRange,
  entities: Pick<Entities, 'scenes' | 'slots'>,
  queue: Queue,
) => {
  const queues = getQueuesWithinRange(beatsRange, entities, queue);

  return queues.map((queue) => {
    return {
      start: queue.start,
      end: queue.end,
      slots: queue.playingSlots,
    };
  });
};
