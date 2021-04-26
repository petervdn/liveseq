import type { Beats, BeatsRange } from '../core/types';

export const isTimeInRange = (time: Beats, range: BeatsRange) => {
  return time >= range.start && time <= range.end;
};
