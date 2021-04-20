import { fromEvent } from 'callbag-common';

export const pushable = <T>() => {
  type ListenerCallback = null | ((data: T) => void);

  let internalListener: ListenerCallback = null;

  const push = (data: T) => {
    internalListener && internalListener(data);
  };

  const addEventListener = (type: string, listener: ListenerCallback) => {
    internalListener = listener;
  };

  const removeEventListener = () => {
    internalListener = null;
  };

  // can be ignored safely, expects a different type but fromEvent doesn't need that internally
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const source = fromEvent({ addEventListener, removeEventListener }, '');

  return [source, push] as const;
};
