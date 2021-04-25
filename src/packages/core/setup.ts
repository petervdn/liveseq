import { combine, map, pipe, Source } from 'callbag-common';
import share from 'callbag-share';
import type { Bpm, TimeInSeconds } from '../time/types';
import { createSubject$WithPush } from './streams/subject$WithPush';
import { timeToBeats } from '../time/musicTime';
import { createTrigger$ } from './streams/trigger';
import { getPlaybackStreams, PlaybackSources } from './streams/playback';
import { createRange } from '../time/beatsRange/beatsRange';
import { getClockStreams } from './streams/clock';

export const getSetupSourcesWithHandlers = () => {
  const [play$, play] = createTrigger$();
  const [stop$, stop] = createTrigger$();
  const [pause$, pause] = createTrigger$();
  const [tempo$, setTempo] = createSubject$WithPush(120 as Bpm);
  const [lookahead$, setLookahead] = createSubject$WithPush(1.2 as TimeInSeconds);
  const [timeInterval$, setTimeInterval] = createSubject$WithPush(1 as TimeInSeconds);

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
  };
};

type SetupProps = {
  // TODO: convert to pullable source?
  getCurrentTime: () => TimeInSeconds;
  sources: PlaybackSources & {
    tempo$: Source<Bpm>;
    lookahead$: Source<TimeInSeconds>;
    timeInterval$: Source<TimeInSeconds>;
  };
};

// TODO: all of the resulting streams must be shared... and also we don't need to use subject for everything inside
// TODO: perhaps use pipe-me library https://github.com/sartaj/pipe-me/blob/master/index.js
export const setup = (props: SetupProps) => {
  const { sources, getCurrentTime } = props;
  const playbackStreams = getPlaybackStreams(props);
  const { startTime$ } = playbackStreams;
  const { elapsedTime$, interval$ } = getClockStreams({
    sources: {
      ...props.sources,
      ...playbackStreams,
    },
    getCurrentTime,
  });
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
    ...sources,
    ...playbackStreams,
    startTime$,
    elapsedTime$,
    interval$,
    timeRange$,
    beatsRange$,
  };
};
