import { combine, flatten, map, pipe, Source } from 'callbag-common';
import share from 'callbag-share';

// TODO: only works after second time
// source b is the guiding stream...
// TODO: not sure if exactly as RXJS but the idea is to have a leading source so we don't get repeated values
export const withLatestFrom = <A, B>(sourceA$: Source<A>, sourceB$: Source<B>) => {
  const combined$ = combine(sourceA$, sourceB$);

  return pipe(
    sourceB$,
    map(() => combined$),
    flatten,
    share,
  );
};
