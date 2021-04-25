import { flatten, map, pipe, Source } from 'callbag-common';
import { createNoop$ } from './noop';

export const onlyWhen = (isPlaying$: Source<boolean>) => <T>(source$: Source<T>) => {
  const noop$ = createNoop$();
  return pipe(
    isPlaying$,
    map((isEnabled) => (isEnabled ? source$ : noop$)),
    flatten,
  );
};
