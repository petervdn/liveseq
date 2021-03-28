import type { ScheduleNote } from '../../player/player';
import type { SamplerInstrument } from './sampler';
import type { Entities } from '../entities';
import type { OmitId } from '../../types';

export type SerializableInstrument = SamplerInstrument; //  | SimpleSynthInstrument;

export type InstrumentInstance = {
  schedule: (notes: Array<ScheduleNote>) => void;
};

export const addInstrument = (
  entities: Entities,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: OmitId<SerializableInstrument>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getId: () => string,
): Entities => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const id = getId();

  return {
    ...entities,
    instruments: {
      ...entities.instruments,
      // TODO: fix props as this asks for audioContext :`|
      // [id]: createSamplerEntity({ ...props, id }),
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
