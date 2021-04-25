import type { Source } from 'callbag-common';

export type SourceType<Type> = Type extends Source<infer X> ? X : never;
