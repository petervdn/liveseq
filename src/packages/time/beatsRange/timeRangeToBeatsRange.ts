import { timeToBeats } from '../musicTime';
import type { BeatsRange } from './beatsRange';
import type { Bpm, TimeRange } from '../types';

export const timeRangeToBeatsRange = (timeRange: TimeRange, bpm: Bpm): BeatsRange => {
  return {
    start: timeToBeats(timeRange.start, bpm),
    end: timeToBeats(timeRange.end, bpm),
  };
};
