import type { InstrumentChannelInstance } from '../instrumentChannel';
import type { Entities } from '../entities';

export const getInstrumentChannelsBySlotId = (
  entities: Pick<Entities, 'instrumentChannels'>,
  slotId: string,
): Array<InstrumentChannelInstance> => {
  return Object.values(entities.instrumentChannels.getRecord()).filter((channel) => {
    return channel.slotIds.includes(slotId);
  });
};
