import type { LiveseqEntity } from '../liveseqEntity';

export type InstrumentChannel = LiveseqEntity & {
  type: 'instrument';
  instrumentId: string;
  slotIds: Array<string>;
};

// ready for adding more types of channels
export type Channel = InstrumentChannel;
