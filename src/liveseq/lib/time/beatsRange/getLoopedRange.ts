import type { Beats } from '../../types';
import { getRangeDuration } from './getRangeDuration';
import type { BeatsRange } from './beatsRange';
import { createRangeFromDuration } from './createRangeFromDuration';

// given a range and a number of loops, what is the resulting range?

export const getLoopedRange = (range: BeatsRange, loops: number): BeatsRange => {
  const times = Math.max(0, loops + 1);
  const newDuration = (getRangeDuration(range) * times) as Beats;
  return createRangeFromDuration(newDuration, range.start);
};
