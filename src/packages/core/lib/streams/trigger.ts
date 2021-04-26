import type { Source } from 'callbag-common';
import { createSubject$WithPush } from './subject$WithPush';

export type Trigger = Source<null>;

export const createTrigger$ = (hasInitial?: boolean): [Trigger, () => void] => {
  const [subject$, push] = createSubject$WithPush<null>(hasInitial ? null : undefined);

  const setValue = () => {
    push(null);
  };

  return [subject$, setValue];
};
