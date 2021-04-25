import type { Bpm, TimeInSeconds } from '../time/types';
import { createTrigger$ } from './streams/trigger';
import { createSubject$WithPush } from './streams/subject$WithPush';
import { extract } from './utils/extract';

// yep :`|
export type CreateInputPropsProps = {
  lookAheadTime: TimeInSeconds;
  scheduleInterval: TimeInSeconds;
  tempo: Bpm;
};

export type InputProps = ReturnType<typeof createInputProps>;

export const createInputProps = ({
  lookAheadTime,
  scheduleInterval,
  tempo,
}: CreateInputPropsProps) => {
  const [play$, play] = createTrigger$();
  const [stop$, stop] = createTrigger$(true);
  const [pause$, pause] = createTrigger$();
  const [tempo$, setTempo] = createSubject$WithPush(tempo);
  const [lookahead$, setLookahead] = createSubject$WithPush(lookAheadTime);
  const [timeInterval$, setTimeInterval] = createSubject$WithPush(scheduleInterval);

  return {
    sources: {
      play$,
      stop$,
      pause$,
      tempo$,
      lookahead$,
      timeInterval$,
    },
    handlers: {
      play,
      stop,
      pause,
      setTempo,
      setLookahead,
      setTimeInterval,
    },
    getters: {
      getTempo: () => extract(tempo$),
      getLookahead: () => extract(lookahead$),
    },
  };
};
