import type { ScheduleNote } from '../../player/player';
import type { SamplerInstrument } from './sampler';
import type { Entities } from '../entities';
import type { OmitId } from '../../types';
import { createSamplerEntity } from './sampler';

export type SerializableInstrument = SamplerInstrument; //  | SimpleSynthInstrument;

export type InstrumentInstance = {
  schedule: (notes: Array<ScheduleNote>, audioContext: AudioContext) => void;
};

export const addInstrument = (
  entities: Entities,
  props: OmitId<SerializableInstrument>,
  id: string,
): Entities => {
  return {
    ...entities,
    instruments: {
      ...entities.instruments,
      [id]: createSamplerEntity({ ...props, id }),
    },
  };
};

export const removeInstrument = (entities: Entities, instrumentId: string): Entities => {
  const result = {
    ...entities,
    instruments: {
      ...entities.instruments,
    },
  };

  delete result.instruments[instrumentId];

  // TODO: search and remove any references by id

  return result;
};
