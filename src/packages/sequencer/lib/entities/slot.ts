import type { CommonProps, Disposable, PartialCommonProps } from '../types';
import { createEntries } from '../../../entries/entries';
import { identity } from '../../../core/utils/identity';
import { always } from '../../../core/utils/always';
import { noop } from '../../../core/utils/noop';

export type TimelineSlot = CommonProps & {
  type: 'timelineSlot';
  timelineId: string;
  loops: number;
};

export type SerializableSlot = TimelineSlot;
export type SlotInstance = Disposable<SerializableSlot>;

export const createSlotEntries = () => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return createEntries<'slots', SlotInstance, PartialCommonProps<SerializableSlot>, {}>(
    'slots',
    (serializable) => {
      return {
        ...serializable,
        isEnabled: true,
        dispose: noop,
      };
    },
    identity,
    always({}),
  );
};
