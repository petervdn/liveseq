import type { Beats } from '../../types';
import type { BeatsRange } from './beatsRange';

export const addToRange = <T extends BeatsRange>(range: T, offsetBy: Beats): T => {
  return {
    ...range,
    start: range.start + offsetBy,
    end: range.end + offsetBy,
  };
};
