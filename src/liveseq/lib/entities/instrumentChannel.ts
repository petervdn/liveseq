import type { CommonProps, Disposable } from '../types';
import { createEntries } from '../entries/entries';
import { identity } from '../utils/identity';
import { without } from '../utils/without';
import type { MixerChannel, Mixer } from '../mixer/mixer';
import type { ScheduleNote } from '../scheduler/scheduler';

export type Instrument = {
  // when the player calls instrument.schedule, it will already pass notes with time in seconds
  schedule: (notes: Array<ScheduleNote>, channelMixer: MixerChannel) => () => void;
};

export type SerializableInstrumentChannel = CommonProps & {
  instrumentId: string;
  slotIds: Array<string>;
};

export type InstrumentChannelInstance = Disposable<
  SerializableInstrumentChannel & {
    getMixerChannel: () => MixerChannel;
  }
>;

type ExtraMethods = {
  addSlotReference: (channelId: string, slotId: string) => void;
  removeSlotReference: (channelId: string, slotId: string) => void;
};

export const createInstrumentChannelEntries = (mixer: Mixer) => {
  return createEntries<
    'instrumentChannels',
    InstrumentChannelInstance,
    SerializableInstrumentChannel,
    ExtraMethods
  >(
    'instrumentChannels',
    (serializable) => {
      const mixerChannel = mixer.addChannel(0.75, 0);
      return {
        ...serializable,
        getMixerChannel: () => {
          return mixerChannel;
        },
        dispose: () => {
          mixerChannel.dispose();
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
