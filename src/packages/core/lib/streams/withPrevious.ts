import type { Source } from 'callbag-common';
import { map, pipe, tap } from 'callbag-common';

export const withPrevious = <T>(source$: Source<T>) => {
  let hasPrevious = false;
  let previous: T | undefined;
  return pipe(
    source$,
    map((x) => [x, previous, hasPrevious] as const),
    tap(([x]) => {
      previous = x;
      hasPrevious = true;
    }),
  );
};
