import { createRange } from './beatsRange';
import { createRangeFromDuration } from './createRangeFromDuration';
import type { Beats } from '../core/lib/types';

it('createRangeFromDuration', () => {
  expect(createRangeFromDuration(10 as Beats)).toEqual(createRange(0 as Beats, 10 as Beats));
});
