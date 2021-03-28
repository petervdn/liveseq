import type { BeatsRange } from '../time/beatsRange';
import type { SceneEntity } from '../entities/scene/scene';
import { createRange, isTimeInRange } from '../time/beatsRange';
import type { Entities } from '../entities/entities';
import { getNotesForInstrumentInTimeRange } from './schedule.utils';
import type { Beats, Bpm } from '../types';

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

type QueuedScenesByStart = Record<number, Array<QueuedScene>>;

export const groupQueuedScenesByStart = (
  start: Beats,
  queuedScenes: Array<QueuedScene>,
): QueuedScenesByStart => {
  return queuedScenes.reduce<QueuedScenesByStart>(
    (accumulator, current) => {
      const start = current.start as number;

      if (!('start' in accumulator)) {
        accumulator[start] = [];
      }

      accumulator[start].push(current);

      return accumulator;
    },
    // we need it to always contain the start as that is just the slotPlaybackState unmodified
    { [start]: [] },
  );
};

// TODO: better naming
// this is probably the reason it doesn't work at all right now
export const getAppliedStatesForQueuedScenes = (
  beatsRange: BeatsRange,
  queuedScenesByStart: QueuedScenesByStart,
  entities: Pick<Entities, 'scenes' | 'slots'>,
  slotPlaybackState: SlotPlaybackState,
) => {
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

// given a range and a slotPlaybackState, get an array of slotPlaybackState with the respective sub ranges
export const getSlotPlaybackStatesWithinRange = (
  beatsRange: BeatsRange,
  entities: Pick<Entities, 'scenes' | 'slots'>,
  slotPlaybackState: SlotPlaybackState,
): Array<BeatsRange & SlotPlaybackState> => {
  const queuedScenes = getQueuedScenesWithinRange(beatsRange, slotPlaybackState);

  const queuedScenesByStart = groupQueuedScenesByStart(beatsRange.start, queuedScenes);

  return getAppliedStatesForQueuedScenes(
    beatsRange,
    queuedScenesByStart,
    entities,
    slotPlaybackState,
  );
};

export const getScheduleItemsWithinRange = (
  beatsRange: BeatsRange,
  entities: Entities,
  bpm: Bpm,
  slotPlaybackState: SlotPlaybackState,
  previouslyScheduledNoteIds: Array<string>,
) => {
  // we must split the beatsRange into sections where the playing slots in the slotPlaybackState changes
  const slotPlaybackStates = getSlotPlaybackStatesWithinRange(
    beatsRange,
    entities,
    slotPlaybackState,
  );

  // the first slotPlaybackState becomes the new slotPlaybackState assuming we always move ahead in time
  // TODO: make sure this is correct
  const nextSlotPlaybackState = slotPlaybackStates[0];

  // then we get schedule items according to those split ranges and their playing slots
  const scheduleItems = slotPlaybackStates.flatMap((slotRange) => {
    const slotIds = slotRange.playingSlots.map((slot) => slot.slotId);

    return getNotesForInstrumentInTimeRange(
      entities,
      slotIds,
      beatsRange,
      bpm,
      previouslyScheduledNoteIds,
    );
  });

  return {
    nextSlotPlaybackState,
    scheduleItems,
  };
};
