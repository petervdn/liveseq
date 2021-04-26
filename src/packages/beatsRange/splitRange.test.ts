import { splitRange } from './splitRange';
import type { Beats, BeatsRange } from '../core/lib/types';

it('splitRange', () => {
  expect(splitRange({ start: 10, end: 20 } as BeatsRange, 15 as Beats)).toEqual([
    { start: 10, end: 15 },
    { start: 15, end: 20 },
  ]);
});
