import { filter, map, pipe, Source } from 'callbag-common';
import share from 'callbag-share';
import { identity } from '../utils/identity';

export const pulse = (source$: Source<boolean>) => {
  return pipe(
    source$,
    filter(identity),
    map(() => null),
    share,
  );
};
