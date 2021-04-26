import { isInRange } from './isInRange';
import type { BeatsRange } from '../core/types';

export const getItemsInRange = <T extends BeatsRange>(range: BeatsRange, items: Array<T>) => {
  return items.filter((item) => {
    return isInRange(item, range);
  });
};
