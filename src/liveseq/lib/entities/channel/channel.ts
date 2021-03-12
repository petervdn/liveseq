import type { LiveseqEntity } from '../liveSeqEntity';

export type InstrumentChannel = LiveseqEntity & {
  type: 'instrument';
  instrumentId: string;
  slotIds: Array<string>;
};

// ready for adding more types of channels
export type Channel = InstrumentChannel;
