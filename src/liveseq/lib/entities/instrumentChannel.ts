import type { CommonProps } from '../types';
import { createEntries } from '../entries/entries';
import { identity } from '../utils/identity';
import { without } from '../utils/without';

export type SerializableInstrumentChannel = CommonProps & {
  instrumentId: string;
  slotIds: Array<string>;
};

export type InstrumentChannelInstance = SerializableInstrumentChannel;

type ExtraMethods = {
  addSlotReference: (channelId: string, slotId: string) => void;
  removeSlotReference: (channelId: string, slotId: string) => void;
};

export const createInstrumentChannelEntries = () => {
  return createEntries<
    'instrumentChannels',
    InstrumentChannelInstance,
    SerializableInstrumentChannel,
    ExtraMethods
  >('instrumentChannels', identity, identity, (entries) => {
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
  });
};
