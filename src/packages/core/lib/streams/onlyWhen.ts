import { flatten, map, pipe, Source } from 'callbag-common';
import { createNoopSource } from './noop';

export const onlyWhen = (isPlaying$: Source<boolean>) => <T>(source$: Source<T>) => {
  const noop$ = createNoopSource();
  return pipe(
    isPlaying$,
    map((isEnabled) => (isEnabled ? source$ : noop$)),
    flatten,
  );
};
