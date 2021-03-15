import {
  BeatsRange,
  clampRange,
  createRange,
  createRangeFromDuration,
  getLoopedRange,
  getRangeDuration,
  getWrappedRanges,
  isInRange,
  moveRange,
  setEnd,
  setStart,
  splitRange,
  splitRangeByDuration,
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
  // and preserves excess properties
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

  // doesn't let start be greater than end
  // and preserves excess properties
  expect(setEnd({ start: 10 as Beats, end: 20 as Beats, extraProp: true }, 0 as Beats)).toEqual({
    start: 0,
    end: 0,
    extraProp: true,
  });
});

it('splitRangeByDuration', () => {
  expect(splitRangeByDuration({ start: 0, end: 10 } as BeatsRange, 5 as Beats)).toEqual([
    { start: 0, end: 5 },
    { start: 5, end: 10 },
  ]);
});

it('moveRange', () => {
  expect(moveRange({ start: 0, end: 10 } as BeatsRange, 5 as Beats)).toEqual({ start: 5, end: 15 });
});

it('isInRange', () => {
  expect(isInRange({ start: 0, end: 10 } as BeatsRange, { start: 5, end: 15 } as BeatsRange)).toBe(
    true,
  );

  expect(isInRange({ start: 0, end: 10 } as BeatsRange, { start: 10, end: 15 } as BeatsRange)).toBe(
    false,
  );

  expect(isInRange({ start: 0, end: 10 } as BeatsRange, { start: 20, end: 30 } as BeatsRange)).toBe(
    false,
  );
});

it('getLoopedRange', () => {
  // doesn't modify start, only duration
  expect(getLoopedRange({ start: 10, end: 20 } as BeatsRange, 1)).toEqual({
    start: 10,
    end: 30,
  });

  // loop of 1 means it will be 2x
  expect(getLoopedRange({ start: 0, end: 10 } as BeatsRange, 1)).toEqual({
    start: 0,
    end: 20,
  });

  // doesn't do anything if it doesn't have a duration
  expect(getLoopedRange({ start: 10, end: 10 } as BeatsRange, 1)).toEqual({
    start: 10,
    end: 10,
  });
});

it('clampRange', () => {
  expect(
    clampRange({ start: 5, end: 25 } as BeatsRange, { start: 10, end: 20 } as BeatsRange),
  ).toEqual({ start: 10, end: 20 });

  // returns null if new duration is <= 0
  expect(
    clampRange({ start: 5, end: 25 } as BeatsRange, { start: 50, end: 100 } as BeatsRange),
  ).toEqual(null);
});

it('getWrappedRanges', () => {
  // LOOPING
  // 0 loops, range is outside of limit and so we get an empty array
  expect(
    getWrappedRanges({ start: 10, end: 30 } as BeatsRange, { start: 0, end: 10 } as BeatsRange, 0),
  ).toEqual([]);

  // 1 loop, so the range can get wrapped once
  expect(
    getWrappedRanges({ start: 10, end: 30 } as BeatsRange, { start: 0, end: 10 } as BeatsRange, 1),
  ).toEqual([{ start: 0, end: 10, offset: 10 }]);

  // 2 loops, so the range can get wrapped twice
  expect(
    getWrappedRanges({ start: 10, end: 30 } as BeatsRange, { start: 0, end: 10 } as BeatsRange, 2),
  ).toEqual([
    { start: 0, end: 10, offset: 10 },
    { start: 0, end: 10, offset: 20 },
  ]);

  // SPLITTING RANGES
  // works correctly when splitting ranges
  expect(
    getWrappedRanges({ start: 5, end: 15 } as BeatsRange, { start: 0, end: 10 } as BeatsRange, 10),
  ).toEqual([
    { start: 5, end: 10, offset: 0 },
    { start: 0, end: 5, offset: 10 },
  ]);

  expect(
    getWrappedRanges(
      { start: 4, end: 8 } as BeatsRange,
      { start: 0, end: 2 } as BeatsRange,
      Infinity,
    ),
  ).toEqual([
    { start: 0, end: 2, offset: 4 },
    { start: 0, end: 2, offset: 6 },
  ]);

  // this one seems wrong
  // expect(
  //   getWrappedRanges({ start: 5, end: 25 } as BeatsRange, { start: 10, end: 20 } as BeatsRange, 1),
  // ).toEqual();
});
