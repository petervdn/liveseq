import type { CommonProps, OmitId } from '../../types';
import type { EntityManagementProps, AddEntity, RemoveEntity } from '../entityManager';

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
  enter?: ReadonlyArray<SceneAction>; // when it becomes active
  leave?: ReadonlyArray<SceneAction>; // when it becomes inactive
};

export type SceneEntity = ReturnType<typeof createSceneEntity>;

// might be the same as config for now but for the sake of consistency and to get the interface used internally
export const createSceneEntity = (props: SerializableScene): SerializableScene => {
  return props;
};

// MANAGER
export type SceneManager = {
  addScene: AddEntity<OmitId<SerializableScene>>;
  removeScene: RemoveEntity;
};

export const getSceneManager = ({
  addEntity,
  removeEntity,
}: EntityManagementProps): SceneManager => {
  return {
    addScene: (channel) => {
      return addEntity((id) => createSceneEntity({ ...channel, id }));
    },
    removeScene: (channelId) => {
      removeEntity(channelId);

      // TODO: search and remove any references by id
    },
  };
};
