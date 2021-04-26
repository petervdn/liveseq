import type { Beats, Bpm, TimeInSeconds } from '../types';

export const beatsToTime = (beats: Beats, bpm: Bpm): TimeInSeconds => {
  return ((beats * 60) / bpm) as TimeInSeconds;
};
