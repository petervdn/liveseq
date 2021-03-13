import type { BeatsRange } from '../time/timeRange';

export type Note = BeatsRange & {
  id: string;
  velocity: number;
  pitch: string;
};
