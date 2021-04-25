import { combine, map, pipe, Source } from 'callbag-common';
import share from 'callbag-share';
import type { Bpm, TimeInSeconds } from '../time/types';
import { timeToBeats } from '../time/musicTime';
import { getPlaybackSources, PlaybackSources } from './streams/playback';
import { createRange } from '../beatsRange/beatsRange';
import { getClockStreams } from './streams/clock';
import { extract } from './utils/extract';

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
export const player = (props: SetupProps) => {
  const { sources, getCurrentTime } = props;
  const playerSources = getPlaybackSources(props);
  const { startTime$ } = playerSources;
  const { elapsedTime$, interval$ } = getClockStreams({
    sources: {
      ...props.sources,
      ...playerSources,
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
    sources: {
      ...sources,
      ...playerSources,
      startTime$,
      elapsedTime$,
      interval$,
      timeRange$,
      beatsRange$,
    },
    getters: {
      getPlayback: () => extract(playerSources.playback$),
    },
  };
};
