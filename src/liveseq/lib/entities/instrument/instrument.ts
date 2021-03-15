import type { ScheduleNote } from '../../player/player';
import type { SamplerInstrument } from './sampler';

export type SerializableInstrument = SamplerInstrument; //  | SimpleSynthInstrument;

export type InstrumentInstance = {
  schedule: (notes: Array<ScheduleNote>) => void;
};
