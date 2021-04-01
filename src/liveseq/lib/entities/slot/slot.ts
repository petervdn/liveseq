import type { CommonProps, OmitId } from '../../types';
import type { AddEntity, EntityManagementProps, RemoveEntity } from '../entityManager';

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

// MANAGER
export type SlotManager = {
  addSlot: AddEntity<OmitId<SerializableSlot>>;
  removeSlot: RemoveEntity;
};

export const getSlotManager = ({ addEntity, removeEntity }: EntityManagementProps): SlotManager => {
  return {
    addSlot: (slot) => {
      return addEntity((id) => createSlotEntity({ ...slot, id }));
    },
    removeSlot: (slotId) => {
      removeEntity(slotId);

      // TODO: search and remove any references by id
    },
  };
};
