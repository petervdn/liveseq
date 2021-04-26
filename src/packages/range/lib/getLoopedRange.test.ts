import { getLoopedRange } from './getLoopedRange';
import type { BeatsRange } from '../../core/lib/types';

it('getLoopedRange', () => {
  // doesn't modify start, only duration
  expect(getLoopedRange({ start: 10, end: 20 } as BeatsRange, 1)).toEqual({
    start: 10,
    end: 30,
  });

  // loop of 1 means it will be 2x
  expect(getLoopedRange({ start: 0, end: 10 } as BeatsRange, 1)).toEqual({
    start: 0,
    end: 20,
  });

  // doesn't do anything if it doesn't have a duration
  expect(getLoopedRange({ start: 10, end: 10 } as BeatsRange, 1)).toEqual({
    start: 10,
    end: 10,
  });
});
