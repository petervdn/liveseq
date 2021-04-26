import { filter, map, pipe, Source } from 'callbag-common';
import { isEqual } from '../utils/isEqual';
import { withPrevious } from './withPrevious';

export const skipRepeats = (isRepeat = isEqual) => <T>(source$: Source<T>) => {
  return pipe(
    source$,
    withPrevious,
    filter(([current, previous, hasPrevious]) => {
      return !(hasPrevious && isRepeat(current, previous));
    }),
    map(([x]) => x),
  );
};
