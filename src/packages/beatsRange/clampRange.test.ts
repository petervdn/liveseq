import type { BeatsRange } from './beatsRange';
import { clampRange } from './clampRange';

it('clampRange', () => {
  expect(
    clampRange({ start: 5, end: 25 } as BeatsRange, { start: 10, end: 20 } as BeatsRange),
  ).toEqual({ start: 10, end: 20 });

  // returns null if new duration is <= 0
  expect(
    clampRange({ start: 5, end: 25 } as BeatsRange, { start: 50, end: 100 } as BeatsRange),
  ).toEqual(null);
});
