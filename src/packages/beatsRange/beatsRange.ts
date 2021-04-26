import type { BeatsRange } from '../core/lib/types';

export const createRange = (start: number, end: number): BeatsRange => {
  return {
    start,
    end,
  } as BeatsRange;
};
