import type { InstrumentChannelEntity } from './instrumentChannel/instrumentChannel';
import type { Entities } from './entities';

export const getInstrumentChannelsBySlotId = (
  entities: Pick<Entities, 'instrumentChannels'>,
  slotId: string,
): Array<InstrumentChannelEntity> => {
  return Object.values(entities.instrumentChannels).filter((channel) => {
    return channel.slotIds.includes(slotId);
  });
};
