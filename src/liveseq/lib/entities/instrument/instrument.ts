import type { LiveseqEntity } from '../liveseqEntity';
import type { SamplerInstrument } from './sampler';
import type { ScheduleNote } from '../../player/player';

export type SimpleSynthInstrument = LiveseqEntity & {
  type: 'simpleSynthInstrument';
};

export type Instrument = SamplerInstrument | SimpleSynthInstrument;

export type InstrumentInstance = {
  schedule: (context: AudioContext, notes: Array<ScheduleNote>) => void;
};
