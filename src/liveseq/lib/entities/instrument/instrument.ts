import type { LiveseqEntity } from '../liveseqEntity';

export type SamplerInstrument = LiveseqEntity & {
  type: 'samplerInstrument';
};

export type SimpleSynthInstrument = LiveseqEntity & {
  type: 'simpleSynthInstrument';
};

export type Instrument = SamplerInstrument | SimpleSynthInstrument;
