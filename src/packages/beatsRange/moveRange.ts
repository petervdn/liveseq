import type { Beats, BeatsRange } from '../core/types';

// moves whole range to new start
export const moveRange = (range: BeatsRange, newStart: Beats): BeatsRange => {
  const difference = newStart - range.start;

  return {
    start: range.start + difference,
    end: range.end + difference,
  } as BeatsRange;
};
