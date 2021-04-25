import type { BeatsRange } from './beatsRange';
import type { Beats } from '../core/types';

export const addToRange = <T extends BeatsRange>(range: T, offsetBy: Beats): T => {
  return {
    ...range,
    start: range.start + offsetBy,
    end: range.end + offsetBy,
  };
};
