import type { Source } from 'callbag-common';
import { filter, map, merge, pipe } from 'callbag-common';
import share from 'callbag-share';
import { mapTo } from './mapTo';
import { skipRepeats } from './skipRepeats';
import { withPrevious } from './withPrevious';
import type { Trigger } from './trigger';
import { withTime } from './withTime';
import type { TimeInSeconds } from '../types';

export type Playback = 'play' | 'stop' | 'pause' | 'resume';
export type Playback$ = Source<Playback>;

const mapToPlay = mapTo('play' as const);
const mapToPause = mapTo('pause' as const);
const mapToStop = mapTo('stop' as const);
const isPlay = (playback: Playback) => playback === 'play';
const isPause = (playback: Playback) => playback === 'pause';
const isStop = (playback: Playback) => playback === 'stop';
const isResume = (playback: Playback) => playback === 'resume';
const isResuming = (current: Playback, previous: Playback) => {
  return isPlay(current) && isPause(previous);
};
const isRunning = (playback: Playback) => isPlay(playback) || isResume(playback);

export type PlaybackSources = {
  play$: Trigger;
  stop$: Trigger;
  pause$: Trigger;
};

export type GetPlaybackSourcesProps = {
  sources: PlaybackSources;
  getCurrentTime: () => TimeInSeconds;
};

export const getPlaybackSources = ({
  sources: { play$, stop$, pause$ },
  getCurrentTime,
}: GetPlaybackSourcesProps) => {
  // playback status
  const playback$ = pipe(
    merge(mapToPlay(play$), mapToStop(stop$), mapToPause(pause$)),
    skipRepeats(),
    withPrevious,
    filter(([current, previous]) => {
      // only pause when playing
      return !isPause(current) || isPlay(previous!);
    }),
    map(([current, previous]) => {
      // add resume state from pause -> play, which also makes play happen only from stop
      return isResuming(current, previous!) ? 'resume' : current;
    }),

    skipRepeats(),
    share,
  );

  // segmented
  const isPlaying$ = pipe(playback$, map(isPlay), share);
  const isStopped$ = pipe(playback$, map(isStop), share);
  const isPaused$ = pipe(playback$, map(isPause), share);
  const isResumed$ = pipe(playback$, map(isResume), share);
  const isRunning$ = pipe(playback$, map(isRunning), share);

  // events
  const withCurrentTime = withTime(getCurrentTime);

  const onPlay$ = withCurrentTime(isPlaying$);
  const onStop$ = withCurrentTime(isStopped$);
  const onPause$ = withCurrentTime(isPaused$);
  const onResume$ = withCurrentTime(isResumed$);
  const onRun$ = withCurrentTime(isRunning$);

  // // TODO: only works after second resume
  // const pausedDuration$ = pipe(
  //   withLatestFrom(onPause$, onResume$),
  //   map(([pausedTime, resumedTime]) => {
  //     return (resumedTime - pausedTime) as TimeInSeconds;
  //   }),
  //   share,
  // );

  // TODO: update when pausedDuration$ emits
  const startTime$ = pipe(onPlay$, share);

  return {
    playback$,
    isPlaying$,
    isStopped$,
    isPaused$,
    isResumed$,
    isRunning$,
    onPlay$,
    onStop$,
    onPause$,
    onResume$,
    onRun$,
    startTime$,
  };
};
