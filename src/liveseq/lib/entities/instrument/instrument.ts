import type { LiveseqEntity } from '../liveSeqEntity';

export type SamplerInstrument = LiveseqEntity & {
  type: 'sampler';
};

export type SimpleSynthInstrument = LiveseqEntity & {
  type: 'simpleSynth';
};

export type Instrument = SamplerInstrument | SimpleSynthInstrument;
