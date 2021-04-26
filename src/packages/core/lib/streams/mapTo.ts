import { map, pipe } from 'callbag-common';
import share from 'callbag-share';
import type { Trigger } from './trigger';
import { always } from '../utils/always';

export const mapTo = <T>(value: T) => (play$: Trigger) => {
  return pipe(play$, map(always(value)), share);
};
