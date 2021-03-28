import type { Opaque } from 'type-fest';

export type CommonProps = {
  id: string;
  name?: string;
  isEnabled?: boolean;
};
export type OmitId<T extends Pick<CommonProps, 'id'>> = Omit<T, 'id'>;
export type Beats = Opaque<number, 'Beats'>;
export type Bpm = Opaque<number, 'Bpm'>;
export type TimeInSeconds = Opaque<number, 'TimeInSeconds'>;
