import type { LiveseqEntity } from '../entities';

export type SerializableSample = LiveseqEntity & {
  source: string;
};
