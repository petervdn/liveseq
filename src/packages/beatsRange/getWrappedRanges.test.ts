import { getWrappedRanges } from './getWrappedRanges';
import type { BeatsRange } from '../core/lib/types';

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
