import { push } from './push';
import { createSubject$ } from './createSubject';

export const createSubject$WithPush = <T>(initialValue: T | undefined) => {
  const subject$ = createSubject$<T>(initialValue);

  const setValue = (value: T) => {
    push(value, subject$);
  };

  return [subject$, setValue] as const;
};
