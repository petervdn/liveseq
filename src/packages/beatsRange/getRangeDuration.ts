import type { BeatsRange } from './beatsRange';
import type { Beats } from '../core/types';

export const getRangeDuration = (range: BeatsRange): Beats => {
  return (range.end - range.start) as Beats;
};
