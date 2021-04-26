import type { Beats, BeatsRange } from '../core/types';

// generic because we are keeping any extra properties from range

export const setEnd = <T extends BeatsRange>(range: T, end: Beats): T => {
  return {
    ...range,
    start: Math.min(end, range.start) as Beats,
    end,
  };
};
