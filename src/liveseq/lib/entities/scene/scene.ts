import type { CommonProps } from '../../liveseq';
import type { Entities } from '../entities';
import type { OmitId } from '../../types';

export type SceneAction =
  | {
      type: 'playSlots';
      // optional, if not present means all
      slotIds?: ReadonlyArray<string>;
    }
  | {
      type: 'stopSlots';
      // optional, if not present means all
      slotIds?: ReadonlyArray<string>;
    };

export type SerializableScene = CommonProps & {
  eventActions: {
    enter?: ReadonlyArray<SceneAction>; // when it becomes active
    leave?: ReadonlyArray<SceneAction>; // when it becomes inactive
  };
};

export type SceneEntity = ReturnType<typeof createSceneEntity>;

// might be the same as config for now but for the sake of consistency and to get the interface used internally
export const createSceneEntity = (props: SerializableScene): SerializableScene => {
  return props;
};

export const addScene = (
  entities: Entities,
  props: OmitId<SerializableScene>,
  getId: () => string,
): Entities => {
  const id = getId();

  return {
    ...entities,
    scenes: {
      ...entities.scenes,
      [id]: createSceneEntity({ ...props, id }),
    },
  };
};

export const removeScene = (entities: Entities, sceneId: string): Entities => {
  const result = {
    ...entities,
    scenes: {
      ...entities.scenes,
    },
  };

  delete result.scenes[sceneId];

  // TODO: search and remove any references by id

  return result;
};
