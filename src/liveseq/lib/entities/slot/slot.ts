import type { LiveseqEntityConfig } from '../entities';

export type TimelineSlot = LiveseqEntityConfig & {
  type: 'timelineSlot';
  timelineId: string;
  loops: number;
};

// ready for adding more types of slots
export type Slot = TimelineSlot;

export type SlotEntity = ReturnType<typeof createSlotEntity>;

// might be the same as config for now but for the sake of consistency and to get the interface used internally
export const createSlotEntity = (props: Slot): Slot => {
  return props;
};
