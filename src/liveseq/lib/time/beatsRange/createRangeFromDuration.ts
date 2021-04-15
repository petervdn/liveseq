import type { Beats } from '../../types';
import type { BeatsRange } from './beatsRange';

export const createRangeFromDuration = (duration: Beats, start = 0 as Beats): BeatsRange => {
  const end = (start + duration) as Beats;

  return {
    start,
    end,
  };
};
