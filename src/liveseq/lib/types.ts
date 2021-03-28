import type { Opaque } from 'type-fest';
import type { CommonProps } from './liveseq';

export type OmitId<T extends Pick<CommonProps, 'id'>> = Omit<T, 'id'>;
export type Beats = Opaque<number, 'Beats'>;
export type Bpm = Opaque<number, 'Bpm'>;
export type TimeInSeconds = Opaque<number, 'TimeInSeconds'>;
