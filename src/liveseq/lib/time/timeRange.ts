import type { Beats, TimeInSeconds } from './time';

export type BeatsRange = {
  start: Beats;
  end: Beats;
};

export type TimeRange = {
  start: TimeInSeconds;
  end: TimeInSeconds;
};
