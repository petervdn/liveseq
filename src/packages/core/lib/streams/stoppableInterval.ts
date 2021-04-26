import { combine, flatten, interval, map, pipe, Source, startWith } from 'callbag-common';
import { createNoop$ } from './noop';
import type { TimeInSeconds } from '../types';

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
