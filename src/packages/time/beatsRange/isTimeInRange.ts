import type { BeatsRange } from './beatsRange';
import type { Beats } from '../types';

export const isTimeInRange = (time: Beats, range: BeatsRange) => {
  return time >= range.start && time <= range.end;
};
