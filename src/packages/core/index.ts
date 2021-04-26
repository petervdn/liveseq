// general types
export type {
  SourceType,
  Beats,
  Bpm,
  TimeInSeconds,
  Range,
  TimeRange,
  BeatsRange,
} from './lib/types';

// player
export { createPlayer } from './lib/player';
export type { CreatePlayerProps } from './lib/player';

// TODO: better naming (get vs create vs make vs... nothing)
// streams
export { getClockSources } from './lib/streams/clock';
export { extract } from './lib/streams/extract';
export { createNoopSource } from './lib/streams/noop';
export { onlyWhen } from './lib/streams/onlyWhen';
export { getPlaybackSources } from './lib/streams/playback';
export { push } from './lib/streams/push';
export { pulse } from './lib/streams/pulse';
export { skipRepeats } from './lib/streams/skipRepeats';
export { withTime } from './lib/streams/withTime';

// time
export { beatsToTime } from './lib/time/beatsToTime';
export { timeToBeats } from './lib/time/timeToBeats';

// utils
export { always } from './lib/utils/always';
export { createAudioContext } from './lib/utils/createAudioContext';
export { identity } from './lib/utils/identity';
export { isContextSuspended } from './lib/utils/isContextSuspended';
export { isEqual } from './lib/utils/isEqual';
export { noop } from './lib/utils/noop';
export { playTick } from './lib/utils/playTick';
export { resumeAudioContext } from './lib/utils/resumeAudioContext';
export { setTimer } from './lib/utils/setTimer';
export { times } from './lib/utils/times';
export { without } from './lib/utils/without';
