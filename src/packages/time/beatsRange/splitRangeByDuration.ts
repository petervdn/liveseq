import type { BeatsRange } from './beatsRange';
import { splitRange } from './splitRange';
import type { Beats } from '../types';

export const splitRangeByDuration = (range: BeatsRange, duration: Beats): Array<BeatsRange> => {
  return splitRange(range, (range.start + duration) as Beats);
};
