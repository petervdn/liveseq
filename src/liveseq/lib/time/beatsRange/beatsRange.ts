import type { Beats } from '../../types';

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
