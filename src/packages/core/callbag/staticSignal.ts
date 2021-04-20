import { pushable } from './pushable';

// creates a source stream that can be triggered and always sends the same value
export const staticSignal = <T>(value: T) => {
  const [source, push] = pushable();

  return [source, () => push(value)] as const;
};
