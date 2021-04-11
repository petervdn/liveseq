import type { Opaque } from 'type-fest';

export type AllRequired<T> = {
  [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>> ? T[P] : T[P] | undefined;
};
export type Disposable<T> = T & { dispose: () => void };
export type CommonProps = {
  id: string;
  name?: string;
  isEnabled: boolean;
};
export type OmitId<T extends Pick<CommonProps, 'id'>> = Omit<T, 'id'>;
export type WithPartial<T, K extends keyof T> = Omit<T, K> & Partial<T>;
export type PartialCommonProps<T extends CommonProps> = WithPartial<T, 'name' | 'isEnabled'>;

export type Beats = Opaque<number, 'Beats'>;
export type Bpm = Opaque<number, 'Bpm'>;
export type TimeInSeconds = Opaque<number, 'TimeInSeconds'>;
