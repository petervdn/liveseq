import { splitRange } from './splitRange';
import type { Beats, BeatsRange } from '../core/types';

export const splitRangeByDuration = (range: BeatsRange, duration: Beats): Array<BeatsRange> => {
  return splitRange(range, (range.start + duration) as Beats);
};
