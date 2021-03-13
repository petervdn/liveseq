import type { LiveseqEntity } from '../liveseqEntity';

export type Sample = LiveseqEntity & {
  source: string;
};
