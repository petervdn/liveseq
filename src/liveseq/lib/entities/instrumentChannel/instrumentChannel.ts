import type { CommonProps, OmitId } from '../../types';
import type { AddEntity, EntityManagementProps, RemoveEntity } from '../entityManager';
import { without } from '../../utils/without';

export type InstrumentChannel = CommonProps & {
  instrumentId: string;
  slotIds: Array<string>;
};

// ready for adding more types of channels
export type SerializableInstrumentChannel = InstrumentChannel;

export type InstrumentChannelEntity = ReturnType<typeof createInstrumentChannelEntity>;

// might be the same as config for now but for the sake of consistency and to get the interface used internally
export const createInstrumentChannelEntity = (
  props: SerializableInstrumentChannel,
): InstrumentChannel => {
  return props;
};

// MANAGER
export type ChannelManager = {
  addChannel: AddEntity<OmitId<SerializableInstrumentChannel>>;
  removeChannel: RemoveEntity;
  addSlotReference: (channelId: string, slotId: string) => void;
  removeSlotReference: (channelId: string, slotId: string) => void;
  enableChannel: (channelId: string) => void;
  disableChannel: (channelId: string) => void;
};

export const getChannelManager = ({
  addEntity,
  removeEntity,
  updateEntity,
  enable,
  disable,
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
      // TODO: validate slotId (channel id is validated by the update)
      return updateEntity<InstrumentChannelEntity>(channelId, (channel) => {
        return {
          ...channel,
          slotIds: [...channel.slotIds, slotId],
        };
      });
    },
    removeSlotReference: (channelId, slotId) => {
      // TODO: validate slotId (channel id is validated by the update)
      return updateEntity<InstrumentChannelEntity>(channelId, (channel) => {
        return {
          ...channel,
          slotIds: without(channel.slotIds, slotId),
        };
      });
    },
    enableChannel: enable,
    disableChannel: disable,
  };
};
