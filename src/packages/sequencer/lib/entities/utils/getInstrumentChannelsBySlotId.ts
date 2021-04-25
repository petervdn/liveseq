import type { EntityEntries } from '../entities';

export const getInstrumentChannelsBySlotId = (entities: EntityEntries, slotId: string) => {
  return Object.values(entities.instrumentChannels.getRecord()).filter((channel) => {
    return channel.slotIds.includes(slotId);
  });
};
