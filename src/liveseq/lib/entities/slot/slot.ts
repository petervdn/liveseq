import type { LiveseqEntity } from '../entities';

export type TimelineSlot = LiveseqEntity & {
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
