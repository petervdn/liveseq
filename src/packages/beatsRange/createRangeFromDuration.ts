import type { BeatsRange } from './beatsRange';
import type { Beats } from '../core/types';

// TODO: invert arg order
export const createRangeFromDuration = (duration: Beats, start = 0 as Beats): BeatsRange => {
  const end = (start + duration) as Beats;

  return {
    start,
    end,
  };
};
