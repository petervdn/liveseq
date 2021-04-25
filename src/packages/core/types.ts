import type { Source } from 'callbag-common';
import type { Opaque } from 'type-fest';

export type SourceType<Type> = Type extends Source<infer X> ? X : never;
export type Beats = Opaque<number, 'Beats'>;
export type Bpm = Opaque<number, 'Bpm'>;
export type TimeInSeconds = Opaque<number, 'TimeInSeconds'>;
export type Range<T extends number> = {
  start: T;
  end: T;
};
export type TimeRange = Range<TimeInSeconds>;
