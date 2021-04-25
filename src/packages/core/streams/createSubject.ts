import createSubject from 'callbag-subject';
import type { Callbag } from 'callbag-common';
import { pipe, startWith } from 'callbag-common';

export const createSubject$ = <T>(initialValue: T | undefined) => {
  // TODO: since I'm forced to share because of remember, maybe we don't need createSubject
  // const subject$ = pipe(createSubject<T>(), remember, share);
  const subject$ = createSubject<T>();

  const subjectWithInitial$ =
    initialValue !== undefined ? pipe(subject$, startWith(initialValue)) : subject$;
  return subjectWithInitial$ as Callbag<T, T>;
};
