import type { CommonProps, OmitId } from '../../types';
import type { AddEntity, EntityManagementProps, RemoveEntity } from '../entityManager';
import { without } from '../../utils/without';

export type SerializableInstrumentChannel = CommonProps & {
  samplerId: string;
  slotIds: Array<string>;
};

export type InstrumentChannelInstance = SerializableInstrumentChannel;

// const toInstance = (serialized: SerializableInstrumentChannel): InstrumentChannelInstance => {
//   return serialized
// }

// MANAGER
export type InstrumentChannelManager = {
  addInstrumentChannel: AddEntity<OmitId<SerializableInstrumentChannel>>;
  removeInstrumentChannel: RemoveEntity;
  addSlotReference: (channelId: string, slotId: string) => void;
  removeSlotReference: (channelId: string, slotId: string) => void;
  enableInstrumentChannel: (channelId: string) => void;
  disableInstrumentChannel: (channelId: string) => void;
};

export const getInstrumentChannelManager = ({
  addEntity,
  removeEntity,
  updateEntity,
  enable,
  disable,
}: EntityManagementProps): InstrumentChannelManager => {
  return {
    addInstrumentChannel: (channel) => {
      return addEntity((id) => ({ ...channel, id }));
    },
    removeInstrumentChannel: (channelId) => {
      removeEntity(channelId);

      // TODO: search and remove any references by id
    },
    addSlotReference: (channelId, slotId) => {
      // TODO: validate slotId (channel id is validated by the update)
      return updateEntity<InstrumentChannelInstance>(channelId, (channel) => {
        return {
          ...channel,
          slotIds: [...channel.slotIds, slotId],
        };
      });
    },
    removeSlotReference: (channelId, slotId) => {
      // TODO: validate slotId (channel id is validated by the update)
      return updateEntity<InstrumentChannelInstance>(channelId, (channel) => {
        return {
          ...channel,
          slotIds: without(channel.slotIds, slotId),
        };
      });
    },
    enableInstrumentChannel: enable,
    disableInstrumentChannel: disable,
  };
};
