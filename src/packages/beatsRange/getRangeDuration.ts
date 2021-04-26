import type { Beats, BeatsRange } from '../core/types';

export const getRangeDuration = (range: BeatsRange): Beats => {
  return (range.end - range.start) as Beats;
};
