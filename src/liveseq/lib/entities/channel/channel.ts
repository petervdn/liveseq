import type { CommonProps, OmitId } from '../../types';
import type { AddEntity, EntityManagementProps, RemoveEntity } from '../entityManager';

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

// MANAGER
export type ChannelManager = {
  addChannel: AddEntity<OmitId<SerializableChannel>>;
  removeChannel: RemoveEntity;
  addSlotReference: (channelId: string, slotId: string) => void;
  removeSlotReference: (channelId: string, slotId: string) => void;
};

export const getChannelManager = ({
  getEntities,
  addEntity,
  removeEntity,
}: EntityManagementProps): ChannelManager => {
  return {
    addChannel: (channel) => {
      return addEntity((id) => createInstrumentChannelEntity({ ...channel, id }));
    },
    removeChannel: (channelId) => {
      removeEntity(channelId);

      // TODO: search and remove any references by id
    },
    addSlotReference: (channelId, slotId) => {
      // TODO: validate both channelId and slotId
      const channel = getEntities().channels[channelId];
      // mutation!
      channel.slotIds.push(slotId);
    },
    removeSlotReference: (channelId, slotId) => {
      // TODO: validate both channelId and slotId
      const channel = getEntities().channels[channelId];
      // mutation!
      channel.slotIds.push(slotId);
    },
  };
};
