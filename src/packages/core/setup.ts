import { combine, filter, map, merge, pipe, Source } from 'callbag-common';
import share from 'callbag-share';
import type { Bpm, TimeInSeconds } from '../time/types';
import { createSubject$WithPush } from './streams/subject$WithPush';
import { timeToBeats } from '../time/musicTime';
import { createTrigger$, Trigger } from './streams/trigger';
import { isPlaying, mapToPause, mapToPlay, mapToStop } from './streams/playback';
import { createStoppableInterval$ } from './streams/stoppableInterval';
import { dropRepeats } from './streams/dropRepeats';
import { identity } from './utils/identity';
import { createRange } from '../time/beatsRange/beatsRange';

export const getSetupSourcesWithHandlers = () => {
  const [playTrigger$, play] = createTrigger$();
  const [pauseTrigger$, pause] = createTrigger$();
  const [stopTrigger$, stop] = createTrigger$();
  const [tempo$, setTempo] = createSubject$WithPush(120 as Bpm);
  const [lookahead$, setLookahead] = createSubject$WithPush(1.2 as TimeInSeconds);
  const [timeInterval$, setTimeInterval] = createSubject$WithPush(1 as TimeInSeconds);

  return {
    sources: {
      playTrigger$,
      pauseTrigger$,
      stopTrigger$,
      tempo$,
      lookahead$,
      timeInterval$,
    },
    handlers: {
      play,
      pause,
      stop,
      setTempo,
      setLookahead,
      setTimeInterval,
    },
  };
};

type SetupProps = {
  // TODO: convert to pullable source?
  getCurrentTime: () => TimeInSeconds;
  sources: {
    playTrigger$: Trigger;
    pauseTrigger$: Trigger;
    stopTrigger$: Trigger;
    tempo$: Source<Bpm>;
    lookahead$: Source<TimeInSeconds>;
    timeInterval$: Source<TimeInSeconds>;
  };
};

export const setup = ({ sources, getCurrentTime }: SetupProps) => {
  // TODO: all of the resulting streams must be shared... and also we don't need to use subject for everything inside
  const play$ = mapToPlay(sources.playTrigger$);
  const pause$ = mapToPause(sources.pauseTrigger$);
  const stop$ = mapToStop(sources.stopTrigger$);
  const playback$ = pipe(merge(play$, pause$, stop$), dropRepeats(), share);
  const isPlaying$ = pipe(playback$, map(isPlaying), dropRepeats(), share);
  const interval$ = pipe(isPlaying$, createStoppableInterval$(sources.timeInterval$), share);
  const playStartTime$ = pipe(isPlaying$, filter(identity), map(getCurrentTime), share);

  // TODO: keep time when paused
  const elapsedTime$ = pipe(
    combine(playStartTime$, interval$),
    map(([playStartTime]) => {
      return (getCurrentTime() - playStartTime) as TimeInSeconds;
    }),
    share,
  );

  // TODO: maybe do elapsedBeats and convert that to beatsRange instead of having the timeRange
  const timeRange$ = pipe(
    combine(elapsedTime$, sources.lookahead$),
    map(([elapsedTime, lookahead]) => ({
      start: elapsedTime,
      end: (elapsedTime + lookahead) as TimeInSeconds,
    })),
    share,
  );
  const beatsRange$ = pipe(
    combine(timeRange$, sources.tempo$),
    map(([timeRange, tempo]) => {
      return createRange(timeToBeats(timeRange.start, tempo), timeToBeats(timeRange.end, tempo));
    }),
    share,
  );

  return {
    playback$,
    isPlaying$,
    playStartTime$,
    elapsedTime$,
    interval$,
    timeRange$,
    beatsRange$,
    ...sources,
  };
};
