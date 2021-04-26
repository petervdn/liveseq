import { getRangeDuration } from './getRangeDuration';
import type { BeatsRange } from '../../core/lib/types';

it('getRangeDuration', () => {
  expect(getRangeDuration({ start: 10, end: 0 } as BeatsRange)).toEqual(-10);
  expect(getRangeDuration({ start: 10, end: 10 } as BeatsRange)).toEqual(0);
  expect(getRangeDuration({ start: 10, end: 20 } as BeatsRange)).toEqual(10);
});
