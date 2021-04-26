import type { Beats, BeatsRange } from '../core/lib/types';

// TODO: invert arg order
export const createRangeFromDuration = (duration: Beats, start = 0 as Beats): BeatsRange => {
  const end = (start + duration) as Beats;

  return {
    start,
    end,
  };
};
