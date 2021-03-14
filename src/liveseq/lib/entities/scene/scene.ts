import type { GlobalAction } from '../../store/globalStore';
import type { CommonProps } from '../../liveseq';

export type SerializableScene = CommonProps & {
  eventActions: {
    enter?: Array<GlobalAction>; // when it becomes active
    leave?: Array<GlobalAction>; // when it becomes inactive
  };
};

export type SceneEntity = ReturnType<typeof createSceneEntity>;

// might be the same as config for now but for the sake of consistency and to get the interface used internally
export const createSceneEntity = (props: SerializableScene): SerializableScene => {
  return props;
};
