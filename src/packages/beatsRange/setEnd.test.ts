import { setEnd } from './setEnd';
import type { Beats, BeatsRange } from '../core/types';

it('setEnd', () => {
  expect(setEnd({ start: 0, end: 10 } as BeatsRange, 20 as Beats)).toEqual({
    start: 0,
    end: 20,
  });

  // doesn't let start be greater than end
  // and preserves excess properties
  expect(setEnd({ start: 10 as Beats, end: 20 as Beats, extraProp: true }, 0 as Beats)).toEqual({
    start: 0,
    end: 0,
    extraProp: true,
  });
});
