import type { CommonProps } from '../types';
import { createEntries } from '../entries/entries';
import { identity } from '../utils/identity';
import { always } from '../utils/always';

export type TimelineSlot = CommonProps & {
  type: 'timelineSlot';
  timelineId: string;
  loops: number;
};

export type SerializableSlot = TimelineSlot;
export type SlotInstance = SerializableSlot;

export const createSlotEntries = () => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return createEntries<'slots', SlotInstance, SerializableSlot, {}>(
    'slots',
    identity,
    identity,
    always({}),
  );
};
