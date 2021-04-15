import { timeToBeats } from '../musicTime';
import type { TimeRange } from '../timeRange';
import type { Bpm } from '../../types';
import type { BeatsRange } from './beatsRange';

export const timeRangeToBeatsRange = (timeRange: TimeRange, bpm: Bpm): BeatsRange => {
  return {
    start: timeToBeats(timeRange.start, bpm),
    end: timeToBeats(timeRange.end, bpm),
  };
};
