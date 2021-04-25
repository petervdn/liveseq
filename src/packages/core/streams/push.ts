import type { Callbag } from 'callbag-common';

export const push = <T>(data: T, source$: Callbag<T, T>) => {
  source$(1, data);
};
