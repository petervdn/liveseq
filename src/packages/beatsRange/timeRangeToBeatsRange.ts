import { timeToBeats } from '../time/musicTime';
import type { BeatsRange } from './beatsRange';
import type { Bpm, TimeRange } from '../core/types';

export const timeRangeToBeatsRange = (timeRange: TimeRange, bpm: Bpm): BeatsRange => {
  return {
    start: timeToBeats(timeRange.start, bpm),
    end: timeToBeats(timeRange.end, bpm),
  };
};
