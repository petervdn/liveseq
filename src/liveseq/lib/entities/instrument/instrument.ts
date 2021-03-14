// import type { LiveseqEntity } from '../entities';
// import type { SamplerInstrument } from './sampler';
import type { ScheduleNote } from '../../player/player';
import type { SamplerInstrument } from './sampler';

// export type SimpleSynthInstrument = LiveseqEntity & {
//   type: 'simpleSynthInstrument';
// };

export type SerializableInstrument = SamplerInstrument; //  | SimpleSynthInstrument;

export type InstrumentInstance = {
  schedule: (context: AudioContext, notes: Array<ScheduleNote>) => void;
};
