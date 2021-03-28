import type { Entities } from '../entities';
import type { CommonProps, OmitId } from '../../types';

export type InstrumentChannel = CommonProps & {
  type: 'instrumentChannel';
  instrumentId: string;
  slotIds: Array<string>;
};

// ready for adding more types of channels
export type SerializableChannel = InstrumentChannel;

export type ChannelEntity = ReturnType<typeof createInstrumentChannelEntity>;

// might be the same as config for now but for the sake of consistency and to get the interface used internally
export const createInstrumentChannelEntity = (props: SerializableChannel): InstrumentChannel => {
  return props;
};

export const addChannel = (
  entities: Entities,
  props: OmitId<SerializableChannel>,
  getId: () => string,
): Entities => {
  const id = getId();

  return {
    ...entities,
    channels: {
      ...entities.channels,
      [id]: createInstrumentChannelEntity({ ...props, id }),
    },
  };
};

export const removeChannel = (entities: Entities, channelId: string): Entities => {
  const result = {
    ...entities,
    channels: {
      ...entities.channels,
    },
  };

  delete result.channels[channelId];

  // TODO: search and remove any references by id

  return result;
};
