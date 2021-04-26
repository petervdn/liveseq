import type { Beats, BeatsRange } from '../core/lib/types';

export const addToRange = <T extends BeatsRange>(range: T, offsetBy: Beats): T => {
  return {
    ...range,
    start: range.start + offsetBy,
    end: range.end + offsetBy,
  };
};
