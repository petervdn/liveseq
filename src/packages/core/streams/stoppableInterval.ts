import { combine, flatten, interval, map, pipe, Source, startWith } from 'callbag-common';
import type { TimeInSeconds } from '../../time/types';
import { createNoop$ } from './noop';

export const createStoppableInterval$ = (timeInterval$: Source<TimeInSeconds>) => (
  isRunning$: Source<boolean>,
) => {
  const noop$ = createNoop$();

  return pipe(
    combine(isRunning$, timeInterval$),
    map(([isRunning, timeInterval]) => {
      return isRunning
        ? pipe(
            interval(timeInterval * 1000) as Source<TimeInSeconds>,
            map((x) => x + 1),
            startWith(0),
          )
        : noop$;
    }),
    flatten,
  );
};
