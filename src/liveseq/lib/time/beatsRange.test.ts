import {
  BeatsRange,
  createRange,
  createRangeFromDuration,
  getRangeDuration,
  setEnd,
  setStart,
  splitRange,
  timeRangeToBeatsRange,
} from './beatsRange';
import type { Beats, Bpm } from './time';
import type { TimeRange } from './timeRange';

export {};

it('createRange', () => {
  expect(createRange(0 as Beats, 10 as Beats)).toEqual({ start: 0, end: 10 });
});

it('createRangeFromDuration', () => {
  expect(createRangeFromDuration(10 as Beats)).toEqual(createRange(0 as Beats, 10 as Beats));
});

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

it('getRangeDuration', () => {
  expect(getRangeDuration({ start: 10, end: 0 } as BeatsRange)).toEqual(-10);
  expect(getRangeDuration({ start: 10, end: 10 } as BeatsRange)).toEqual(0);
  expect(getRangeDuration({ start: 10, end: 20 } as BeatsRange)).toEqual(10);
});

it('splitRange', () => {
  expect(splitRange({ start: 10, end: 20 } as BeatsRange, 15 as Beats)).toEqual([
    { start: 10, end: 15 },
    { start: 15, end: 20 },
  ]);
});

it('setStart', () => {
  expect(setStart({ start: 0, end: 10 } as BeatsRange, 10 as Beats)).toEqual({
    start: 10,
    end: 10,
  });

  // doesn't let end be less than start
  // and preserves extra props
  expect(setStart({ start: 0 as Beats, end: 10 as Beats, extraProp: true }, 20 as Beats)).toEqual({
    start: 20,
    end: 20,
    extraProp: true,
  });
});

it('setEnd', () => {
  expect(setEnd({ start: 0, end: 10 } as BeatsRange, 20 as Beats)).toEqual({
    start: 0,
    end: 20,
  });

  // doesn't let start be greater than start
  // and preserves extra props
  expect(setEnd({ start: 10 as Beats, end: 20 as Beats, extraProp: true }, 0 as Beats)).toEqual({
    start: 0,
    end: 0,
    extraProp: true,
  });
});
