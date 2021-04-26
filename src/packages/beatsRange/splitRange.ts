import type { Beats, BeatsRange } from '../core/lib/types';

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
