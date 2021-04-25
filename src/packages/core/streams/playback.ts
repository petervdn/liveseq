import type { Source } from 'callbag-common';
import { mapTo } from './mapTo';

export type Playback = 'playing' | 'stopped' | 'paused';
export type Playback$ = Source<Playback>;

export const mapToPlay = mapTo('playing' as const);
export const mapToPause = mapTo('paused' as const);
export const mapToStop = mapTo('stopped' as const);

export const isPlaying = (playback: Playback) => playback === 'playing';
export const isPaused = (playback: Playback) => playback === 'paused';
export const isStopped = (playback: Playback) => playback === 'stopped';
