import { combine, map, pipe, Source } from 'callbag-common';
import share from 'callbag-share';
import { createStoppableInterval$ } from './stoppableInterval';
import type { TimeInSeconds } from '../types';

type ClockSources = {
  // TODO: need to be more accurate than start stop, so we can do pause
  // stops/starts interval
  isRunning$: Source<boolean>;
  timeInterval$: Source<TimeInSeconds>;
  onPlay$: Source<TimeInSeconds>;
  onPause$: Source<TimeInSeconds>;
  onResume$: Source<TimeInSeconds>;
};

export type GetClockStreamsProps = {
  sources: ClockSources;
  getCurrentTime: () => TimeInSeconds;
};

export const getClockStreams = ({
  sources: { timeInterval$, isRunning$, onPlay$ },
  getCurrentTime,
}: GetClockStreamsProps) => {
  // timer
  // TODO: make it support play/pause/stop rather than just play/stop
  const interval$ = pipe(isRunning$, createStoppableInterval$(timeInterval$), share);

  // TODO: keep time when paused
  const elapsedTime$ = pipe(
    combine(onPlay$, interval$),
    map(([playStartTime]) => {
      return (getCurrentTime() - playStartTime) as TimeInSeconds;
    }),
    share,
  );

  return {
    interval$,
    elapsedTime$,
  };
};
