import type { LiveseqEntityConfig } from '../entities';

export type InstrumentChannel = LiveseqEntityConfig & {
  type: 'instrumentChannel';
  instrumentId: string;
  slotIds: Array<string>;
};

// ready for adding more types of channels
export type Channel = InstrumentChannel;

export type ChannelEntity = ReturnType<typeof createInstrumentChannelEntity>;

// might be the same as config for now but for the sake of consistency and to get the interface used internally
export const createInstrumentChannelEntity = (props: InstrumentChannel): InstrumentChannel => {
  return props;
};

export const getChannelsBySlotId = (
  channelsById: Record<string, ChannelEntity>,
  slotId: string,
): Array<ChannelEntity> => {
  return Object.values(channelsById).filter((channel) => {
    return channel.slotIds.includes(slotId);
  });
};
