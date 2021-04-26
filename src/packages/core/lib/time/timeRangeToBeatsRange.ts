import type { BeatsRange, Bpm, TimeRange } from '../types';
import { timeToBeats } from './timeToBeats';

export const timeRangeToBeatsRange = (timeRange: TimeRange, bpm: Bpm): BeatsRange => {
  return {
    start: timeToBeats(timeRange.start, bpm),
    end: timeToBeats(timeRange.end, bpm),
  };
};
