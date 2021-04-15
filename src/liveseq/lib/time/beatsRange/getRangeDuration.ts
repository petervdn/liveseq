import type { Beats } from '../../types';
import type { BeatsRange } from './beatsRange';

export const getRangeDuration = (range: BeatsRange): Beats => {
  return (range.end - range.start) as Beats;
};
