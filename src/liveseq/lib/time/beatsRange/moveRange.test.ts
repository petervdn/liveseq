import type { BeatsRange } from './beatsRange';
import { moveRange } from './moveRange';
import type { Beats } from '../../types';

it('moveRange', () => {
  expect(moveRange({ start: 0, end: 10 } as BeatsRange, 5 as Beats)).toEqual({ start: 5, end: 15 });
});
