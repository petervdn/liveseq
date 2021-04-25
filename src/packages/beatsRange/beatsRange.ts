import type { Beats } from '../core/types';

export type BeatsRange = {
  start: Beats;
  end: Beats;
};

export const createRange = (start: number, end: number): BeatsRange => {
  return {
    start,
    end,
  } as BeatsRange;
};
