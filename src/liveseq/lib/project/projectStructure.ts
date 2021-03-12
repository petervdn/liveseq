import type { LiveseqEntity } from '../entities/liveSeqEntity';

// TODO: define union for all action types
export type GlobalAction =
  | {
      type: 'playSlots';
      // optional, if not present means all
      slotIds?: Array<string>;
    }
  | {
      type: 'stopSlots';
      // optional, if not present means all
      slotIds?: Array<string>;
    };

// SAMPLES
export type Sample = LiveseqEntity & {
  source: string;
};

// PROJECT
