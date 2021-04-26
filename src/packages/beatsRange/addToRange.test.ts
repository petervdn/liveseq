import { addToRange } from './addToRange';
import type { Beats, BeatsRange } from '../core/lib/types';

it('addToRange', () => {
  expect(addToRange({ start: 0, end: 10 } as BeatsRange, 5 as Beats)).toEqual({
    start: 5,
    end: 15,
  });
});
