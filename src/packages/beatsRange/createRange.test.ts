import { createRange } from './beatsRange';
import type { Beats } from '../core/types';

it('createRange', () => {
  expect(createRange(0 as Beats, 10 as Beats)).toEqual({ start: 0, end: 10 });
});
