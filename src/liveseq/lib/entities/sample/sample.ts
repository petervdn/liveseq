import type { LiveseqEntity } from '../liveSeqEntity';

export type Sample = LiveseqEntity & {
  source: string;
};
