import { filter, map, pipe, Source } from 'callbag-common';
import share from 'callbag-share';
import { identity } from '../utils/identity';
import type { TimeInSeconds } from '../../time/types';

export const withTime = (getCurrentTime: () => TimeInSeconds) => (source$: Source<boolean>) => {
  return pipe(source$, filter(identity), map(getCurrentTime), share);
};
