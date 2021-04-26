import type { BeatsRange } from '../core/types';

export const createRange = (start: number, end: number): BeatsRange => {
  return {
    start,
    end,
  } as BeatsRange;
};
