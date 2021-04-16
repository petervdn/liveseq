import type { BeatsRange } from './beatsRange';
import type { Beats } from '../../types';
import { addToRange } from './addToRange';

it('addToRange', () => {
  expect(addToRange({ start: 0, end: 10 } as BeatsRange, 5 as Beats)).toEqual({
    start: 5,
    end: 15,
  });
});
