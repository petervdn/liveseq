import { Source, subscribe } from 'callbag-common';
import { useEffect, useState } from 'react';
import { extract } from '../../core/lib/streams/extract';

// source must "remember" (callbag-remember) its value so it can be extracted, and have an initial value as well
export const useCallbag = <T>(source$: Source<T>) => {
  // TODO: how to get initial value? seems like a BehaviourSubject is needed...
  const [state, setState] = useState<T>(() => extract(source$)!);
  useEffect(() => {
    return subscribe(setState)(source$);
  }, [source$]);

  return state;
};
