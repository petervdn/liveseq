import createSubject from 'callbag-subject';
import type { Callbag } from 'callbag-common';
import { pipe, startWith } from 'callbag-common';

export const createSubject$ = <T>(initialValue: T | undefined) => {
  const subject$ = createSubject<T>();

  const subjectWithInitial$ =
    initialValue !== undefined ? pipe(subject$, startWith(initialValue)) : subject$;
  return subjectWithInitial$ as Callbag<T, T>;
};
