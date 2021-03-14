import type { CommonProps } from '../../liveseq';

export type InstrumentChannel = CommonProps & {
  type: 'instrumentChannel';
  instrumentId: string;
  slotIds: Array<string>;
};

// ready for adding more types of channels
export type SerializableChannel = InstrumentChannel;

export type ChannelEntity = ReturnType<typeof createInstrumentChannelEntity>;

// might be the same as config for now but for the sake of consistency and to get the interface used internally
export const createInstrumentChannelEntity = (props: InstrumentChannel): InstrumentChannel => {
  return props;
};
