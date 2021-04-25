import { map, pipe } from 'callbag-common';
import type { Trigger } from './trigger';
import { always } from '../utils/always';

export const mapTo = <T>(value: T) => (playTrigger$: Trigger) => {
  return pipe(playTrigger$, map(always(value)));
};
