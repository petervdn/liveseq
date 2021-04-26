import type { CommonProps, Disposable, PartialCommonProps } from '../types';
import { createEntries } from '../../../entries/entries';
import { identity } from '../../../core/lib/utils/identity';
import { without } from '../../../core/lib/utils/without';
import type { ScheduleNote } from '../scheduler/scheduler';

// TODO: rename to Channel
export type Instrument = {
  // when the player calls instrument.schedule, it will already pass notes with time in seconds
  schedule: (notes: ScheduleNote) => () => void;
};

export type SerializableInstrumentChannel = CommonProps & {
  instrumentId: string;
  slotIds: Array<string>;
};

export type InstrumentChannelInstance = Disposable<SerializableInstrumentChannel>;

type ExtraMethods = {
  addSlotReference: (channelId: string, slotId: string) => void;
  removeSlotReference: (channelId: string, slotId: string) => void;
};

export const createInstrumentChannelEntries = () => {
  return createEntries<
    'instrumentChannels',
    InstrumentChannelInstance,
    PartialCommonProps<SerializableInstrumentChannel>,
    ExtraMethods
  >(
    'instrumentChannels',
    (serializable) => {
      return {
        isEnabled: true,
        ...serializable,

        dispose: () => {
          // noop
        },
      };
    },
    identity,
    (entries) => {
      return {
        addSlotReference: (channelId, slotId) => {
          // TODO: validate slotId (channel id is validated by the update)
          entries.update(channelId, (channel) => {
            return {
              ...channel,
              slotIds: [...channel.slotIds, slotId],
            };
          });
        },
        removeSlotReference: (channelId, slotId) => {
          // TODO: validate slotId (channel id is validated by the update)
          entries.update(channelId, (channel) => {
            return {
              ...channel,
              slotIds: without(channel.slotIds, slotId),
            };
          });
        },
      };
    },
  );
};
