import { timeRangeToBeatsRange } from './timeRangeToBeatsRange';
import type { Bpm, TimeRange } from '../core/types';

it('timeRangeToBeatsRange', () => {
  expect(timeRangeToBeatsRange({ start: 0, end: 10 } as TimeRange, 60 as Bpm)).toEqual({
    start: 0,
    end: 10,
  });

  expect(timeRangeToBeatsRange({ start: 0, end: 10 } as TimeRange, 120 as Bpm)).toEqual({
    start: 0,
    end: 20,
  });
});
