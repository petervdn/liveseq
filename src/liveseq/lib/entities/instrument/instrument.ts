import type { LiveseqEntity } from '../liveseqEntity';

export type SamplerInstrument = LiveseqEntity & {
  type: 'sampler';
};

export type SimpleSynthInstrument = LiveseqEntity & {
  type: 'simpleSynth';
};

export type Instrument = SamplerInstrument | SimpleSynthInstrument;
