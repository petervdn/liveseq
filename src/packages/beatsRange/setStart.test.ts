import { setStart } from './setStart';
import type { Beats, BeatsRange } from '../core/types';

it('setStart', () => {
  expect(setStart({ start: 0, end: 10 } as BeatsRange, 10 as Beats)).toEqual({
    start: 10,
    end: 10,
  });

  // doesn't let end be less than start
  // and preserves excess properties
  expect(setStart({ start: 0 as Beats, end: 10 as Beats, extraProp: true }, 20 as Beats)).toEqual({
    start: 20,
    end: 20,
    extraProp: true,
  });
});
