import { Source, subscribe } from 'callbag-common';

export const extract = <T>(source$: Source<T>): T | undefined => {
  let value: T | undefined;
  const dispose = subscribe<T | undefined>((streamValue) => {
    value = streamValue;
  })(source$);
  dispose();

  return value;
};
