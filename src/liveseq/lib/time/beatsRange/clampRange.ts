import { getRangeDuration } from './getRangeDuration';
import type { BeatsRange } from './beatsRange';

// might clamp to an invalid duration, so might return null
export const clampRange = (range: BeatsRange, rangeLimit: BeatsRange): BeatsRange | null => {
  const newRange = {
    start: Math.max(range.start, rangeLimit.start),
    end: Math.min(range.end, rangeLimit.end),
  } as BeatsRange;

  const duration = getRangeDuration(newRange);
  return duration > 0 ? newRange : null;
};
