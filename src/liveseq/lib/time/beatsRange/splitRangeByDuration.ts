import type { Beats } from '../../types';
import type { BeatsRange } from './beatsRange';
import { splitRange } from './splitRange';

export const splitRangeByDuration = (range: BeatsRange, duration: Beats): Array<BeatsRange> => {
  return splitRange(range, (range.start + duration) as Beats);
};
