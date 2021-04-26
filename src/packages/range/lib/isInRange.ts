import type { BeatsRange } from '../../core/lib/types';

// is rangeA intersecting rangeB
export const isInRange = (rangeA: BeatsRange, rangeB: BeatsRange) => {
  // todo: btw this implies that starts are before the end, which might not be the case
  return !(rangeA.end <= rangeB.start || rangeA.start >= rangeB.end);
};
