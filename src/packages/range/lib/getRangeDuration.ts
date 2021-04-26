import type { Beats, BeatsRange } from '../../core/lib/types';

export const getRangeDuration = (range: BeatsRange): Beats => {
  return (range.end - range.start) as Beats;
};
