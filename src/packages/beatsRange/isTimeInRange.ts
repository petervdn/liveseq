import type { Beats, BeatsRange } from '../core/lib/types';

export const isTimeInRange = (time: Beats, range: BeatsRange) => {
  return time >= range.start && time <= range.end;
};
