import type { Beats } from '../../types';
import type { BeatsRange } from './beatsRange';

export const splitRange = (range: BeatsRange, splitAt: Beats): Array<BeatsRange> => {
  const isBetween = range.start < splitAt && range.end > splitAt;

  return isBetween
    ? [
        {
          start: range.start,
          end: splitAt,
        },
        {
          start: splitAt,
          end: range.end,
        },
      ]
    : [range];
};
