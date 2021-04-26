import { isInRange } from './isInRange';
import type { BeatsRange } from '../../core/lib/types';

it('isInRange', () => {
  expect(isInRange({ start: 0, end: 10 } as BeatsRange, { start: 5, end: 15 } as BeatsRange)).toBe(
    true,
  );

  expect(isInRange({ start: 0, end: 10 } as BeatsRange, { start: 10, end: 15 } as BeatsRange)).toBe(
    false,
  );

  expect(isInRange({ start: 0, end: 10 } as BeatsRange, { start: 20, end: 30 } as BeatsRange)).toBe(
    false,
  );
});
