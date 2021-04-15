import type { Beats } from '../../types';
import type { BeatsRange } from './beatsRange';

export const isTimeInRange = (time: Beats, range: BeatsRange) => {
  return time >= range.start && time <= range.end;
};
