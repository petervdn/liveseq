import type { Beats } from '../../types';
import type { QueuedScene } from '../scheduler';

export type QueuedScenesByStart = Record<number, Array<QueuedScene>>;
export const groupQueuedScenesByStart = (
  start: Beats,
  queuedScenes: Array<QueuedScene>,
): QueuedScenesByStart => {
  return queuedScenes.reduce<QueuedScenesByStart>(
    (accumulator, current) => {
      const start = current.start as number;

      if (!('start' in accumulator)) {
        accumulator[start] = [];
      }

      accumulator[start].push(current);

      return accumulator;
    },
    // we need it to always contain the start as that is just the slotPlaybackState unmodified
    { [start]: [] },
  );
};