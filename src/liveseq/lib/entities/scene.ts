import type { CommonProps, Disposable } from '../types';
import { createEntries } from '../entries/entries';
import { identity } from '../utils/identity';
import { always } from '../utils/always';
import { noop } from '../utils/noop';

type PlaySlotsAction = {
  type: 'playSlots';
  // optional, if not present means all
  slotIds?: ReadonlyArray<string>;
};

export const playSlots = (slotIds?: ReadonlyArray<string>): PlaySlotsAction => {
  return {
    type: 'playSlots',
    slotIds,
  };
};

type StopSlotsAction = {
  type: 'stopSlots';
  // optional, if not present means all
  slotIds?: ReadonlyArray<string>;
};

export const stopSlots = (slotIds?: ReadonlyArray<string>): StopSlotsAction => {
  return {
    type: 'stopSlots',
    slotIds,
  };
};

export type SceneAction = PlaySlotsAction | StopSlotsAction;

export type SerializableScene = CommonProps & {
  enter?: ReadonlyArray<SceneAction>; // when it becomes active
  leave?: ReadonlyArray<SceneAction>; // when it becomes inactive
};

export type SceneInstance = Disposable<SerializableScene>;

export const createSceneEntries = () => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return createEntries<'scenes', SceneInstance, SerializableScene, {}>(
    'scenes',
    (serializable) => {
      return {
        ...serializable,
        dispose: noop,
      };
    },
    identity,
    always({}),
  );
};
