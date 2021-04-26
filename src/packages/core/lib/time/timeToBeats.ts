import type { Beats, Bpm, TimeInSeconds } from '../types';

export const timeToBeats = (time: TimeInSeconds, bpm: Bpm): Beats => {
  return ((time / 60) * bpm) as Beats;
};
