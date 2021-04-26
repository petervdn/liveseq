import type { Beats, BeatsRange } from '../core/types';

// generic because we are keeping any extra properties from range
export const setStart = <T extends BeatsRange>(range: T, start: Beats): T => {
  return {
    ...range,
    start,
    end: Math.max(range.end, start),
  };
};
