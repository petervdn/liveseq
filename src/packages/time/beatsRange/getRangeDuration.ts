import type { BeatsRange } from './beatsRange';
import type { Beats } from '../types';

export const getRangeDuration = (range: BeatsRange): Beats => {
  return (range.end - range.start) as Beats;
};
