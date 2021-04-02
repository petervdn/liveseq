import type { InstrumentChannelInstance } from './instrumentChannel/serializableInstrumentChannel';
import type { Entities } from './entities';

export const getInstrumentChannelsBySlotId = (
  entities: Pick<Entities, 'instrumentChannels'>,
  slotId: string,
): Array<InstrumentChannelInstance> => {
  return Object.values(entities.instrumentChannels).filter((channel) => {
    return channel.slotIds.includes(slotId);
  });
};
