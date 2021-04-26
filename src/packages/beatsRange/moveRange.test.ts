import { moveRange } from './moveRange';
import type { Beats, BeatsRange } from '../core/lib/types';

it('moveRange', () => {
  expect(moveRange({ start: 0, end: 10 } as BeatsRange, 5 as Beats)).toEqual({ start: 5, end: 15 });
  expect(moveRange({ start: 5, end: 15 } as BeatsRange, 0 as Beats)).toEqual({ start: 0, end: 10 });
});
