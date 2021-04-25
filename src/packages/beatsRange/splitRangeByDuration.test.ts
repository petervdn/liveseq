import type { BeatsRange } from './beatsRange';
import { splitRangeByDuration } from './splitRangeByDuration';
import type { Beats } from '../time/types';

it('splitRangeByDuration', () => {
  expect(splitRangeByDuration({ start: 0, end: 10 } as BeatsRange, 5 as Beats)).toEqual([
    { start: 0, end: 5 },
    { start: 5, end: 10 },
  ]);
});
