import type { Beats } from '../time/time';
import type { BeatsRange } from '../time/beatsRange';
import type { SceneEntity } from '../entities/scene/scene';
import { createRange, isTimeInRange } from '../time/beatsRange';
import type { Entities } from '../entities/entities';

type PlayingSlot = {
  slotId: string;
  start: Beats;
};

export type QueuedScene = BeatsRange & {
  sceneId: string;
};

export type SlotPlaybackState = {
  playingSlots: Array<PlayingSlot>;
  activeSceneIds: Array<string>;
  queuedScenes: Array<QueuedScene>;
};

export const createSlotPlaybackState = (): SlotPlaybackState => {
  const defaultSlotPlaybackState = {
    playingSlots: [],
    activeSceneIds: [],
    queuedScenes: [],
  };

  return defaultSlotPlaybackState;
};

export const addScenesToQueue = (
  scenes: Array<QueuedScene>,
  slotPlaybackState: SlotPlaybackState,
): SlotPlaybackState => {
  return {
    ...slotPlaybackState,
    queuedScenes: slotPlaybackState.queuedScenes.concat(scenes).sort((sceneA, sceneB) => {
      // eslint-disable-next-line no-nested-ternary
      return sceneA.start < sceneB.start ? -1 : sceneA.start > sceneB.start ? 1 : 0;
    }),
  };
};

const isSameQueuedScene = (queuedSceneA: QueuedScene, queuedSceneB: QueuedScene) => {
  return queuedSceneA.sceneId === queuedSceneB.sceneId && queuedSceneA.start === queuedSceneB.start;
};

export const removeScenesFromQueue = (
  scenes: Array<QueuedScene>,
  slotPlaybackState: SlotPlaybackState,
): SlotPlaybackState => {
  return {
    ...slotPlaybackState,
    queuedScenes: slotPlaybackState.queuedScenes.filter((queuedSceneA) => {
      return !scenes.find((queuedSceneB) => isSameQueuedScene(queuedSceneA, queuedSceneB));
    }),
  };
};

export const applyScenesToSlotPlaybackState = (
  scenes: Array<Pick<SceneEntity, 'id' | 'isEnabled' | 'eventActions'>>,
  entities: Pick<Entities, 'slots'>,
  slotPlaybackState: SlotPlaybackState,
  start: Beats,
): SlotPlaybackState => {
  // TODO: consider isEnabled
  // TODO: incomplete implementation, only plays
  const appliedScenes = scenes.flatMap((scene) => {
    return (scene.eventActions.enter || []).flatMap((action) => {
      if (action.type === 'playSlots') {
        // if not specified we get all
        const slotIds = action.slotIds || Object.keys(entities.slots);

        return slotIds.map((id) => {
          return {
            slotId: id,
            start,
          };
        });
      }
      if (action.type === 'stopSlots') {
        // gotta stop em, maybe need to use reduce instead of flatMap so we can mess up with accumulator
      }
      return [];
    });
  });

  const playingSlots = slotPlaybackState.playingSlots.concat(appliedScenes);

  const activeSceneIds = scenes.map((scene) => scene.id); // TODO: incomplete

  return {
    ...slotPlaybackState,
    playingSlots,
    activeSceneIds,
  };
};

// find the scenes that will get triggered in the beatsRange
export const getQueuedScenesWithinRange = (
  beatsRange: BeatsRange,
  slotPlaybackState: SlotPlaybackState,
): Array<QueuedScene> => {
  return slotPlaybackState.queuedScenes.filter((queuedScene) => {
    // TODO: maybe .start is not enough a check since it also has an end
    return isTimeInRange(queuedScene.start, beatsRange);
  });
};

// given a range and a slotPlaybackState, get an array of slotPlaybackState with the respective sub ranges
export const getSlotPlaybackStatesWithinRange = (
  beatsRange: BeatsRange,
  entities: Pick<Entities, 'scenes' | 'slots'>,
  slotPlaybackState: SlotPlaybackState,
): Array<BeatsRange & SlotPlaybackState> => {
  // 1. find the scenes that will get triggered within the beatsRange
  const queuedScenes = getQueuedScenesWithinRange(beatsRange, slotPlaybackState);

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
    // we need it to always contain the start as that is just the slotPlaybackState unmodified
    { [beatsRange.start]: [] },
  );

  // 3. map the result of step 2 into an array of slotPlaybackStates with ranges and the corresponding scenes applied
  // this depends on ordering of the object keys, but they are already sorted when added since we probably read way more than write
  // TODO: ^ make sure the order is correct
  return Object.entries(queuedScenesByStart)
    .map(([key, value]) => {
      // TODO: see if we can remove this parseInt
      return [parseInt(key, 10), value] as const;
    })
    .reduce<Array<BeatsRange & SlotPlaybackState>>((accumulator, current, index, entries) => {
      const [start, queuedScenes] = current;

      // get from next entry's start, or beatsRange.end
      const end = index <= entries.length - 2 ? entries[index + 1][0] : beatsRange.end;

      // get slotPlaybackState from previous item in accumulator if there is one
      const currentSlotPlaybackState = index > 0 ? accumulator[index - 1] : slotPlaybackState;

      const sceneEntities = queuedScenes.map((scene) => {
        return entities.scenes[scene.sceneId];
      });

      const appliedSlotPlaybackState = {
        ...removeScenesFromQueue(
          queuedScenes,
          applyScenesToSlotPlaybackState(
            sceneEntities,
            entities,
            currentSlotPlaybackState,
            start as Beats,
          ),
        ),
        ...createRange(start as Beats, end as Beats),
      };

      accumulator.push(appliedSlotPlaybackState);

      return accumulator;
    }, []);
};

export const getSlotsWithinRange = (
  beatsRange: BeatsRange,
  entities: Pick<Entities, 'scenes' | 'slots'>,
  slotPlaybackState: SlotPlaybackState,
) => {
  const slotPlaybackStates = getSlotPlaybackStatesWithinRange(
    beatsRange,
    entities,
    slotPlaybackState,
  );

  return slotPlaybackStates.map((slotPlaybackState) => {
    return {
      start: slotPlaybackState.start,
      end: slotPlaybackState.end,
      slots: slotPlaybackState.playingSlots,
      slotPlaybackState,
    };
  });
};
