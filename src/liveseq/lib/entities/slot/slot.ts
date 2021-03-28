import type { Entities } from '../entities';
import type { CommonProps, OmitId } from '../../types';

export type TimelineSlot = CommonProps & {
  type: 'timelineSlot';
  timelineId: string;
  loops: number;
};

// ready for adding more types of slots
export type SerializableSlot = TimelineSlot;

export type SlotEntity = ReturnType<typeof createSlotEntity>;

// might be the same as config for now but for the sake of consistency and to get the interface used internally
export const createSlotEntity = (props: SerializableSlot): SerializableSlot => {
  return props;
};

export const addSlot = (
  entities: Entities,
  props: OmitId<SerializableSlot>,
  getId: () => string,
): Entities => {
  const id = getId();

  return {
    ...entities,
    slots: {
      ...entities.slots,
      [id]: createSlotEntity({ ...props, id }),
    },
  };
};

export const removeSlot = (entities: Entities, slotId: string): Entities => {
  const result = {
    ...entities,
    slots: {
      ...entities.slots,
    },
  };

  delete result.slots[slotId];

  // TODO: search and remove any references by id

  return result;
};
