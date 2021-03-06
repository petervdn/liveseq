import { combine, map, pipe, Source } from 'callbag-common';
import share from 'callbag-share';
import { getPlaybackSources, PlaybackSources } from './streams/playback';
import { getClockSources } from './streams/clock';
import { extract } from './streams/extract';
import type { Bpm, TimeInSeconds } from './types';
import { timeRangeToBeatsRange } from './time/timeRangeToBeatsRange';

export type CreatePlayerProps = {
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
export const createPlayer = (props: CreatePlayerProps) => {
  const { sources, getCurrentTime } = props;
  const playerSources = getPlaybackSources(props);
  const { startTime$ } = playerSources;
  const { elapsedTime$, interval$ } = getClockSources({
    sources: {
      ...props.sources,
      ...playerSources,
    },
    getCurrentTime,
  });

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
      return timeRangeToBeatsRange(timeRange, tempo);
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
