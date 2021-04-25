import type { BeatsRange } from './beatsRange';
import type { Beats } from '../time/types';

// generic because we are keeping any extra properties from range
export const setStart = <T extends BeatsRange>(range: T, start: Beats): T => {
  return {
    ...range,
    start,
    end: Math.max(range.end, start),
  };
};
