import type { LiveseqEntity } from '../liveseqEntity';
import type { SamplerInstrument } from './sampler';

export type SimpleSynthInstrument = LiveseqEntity & {
  type: 'simpleSynthInstrument';
};

export type Instrument = SamplerInstrument | SimpleSynthInstrument;
