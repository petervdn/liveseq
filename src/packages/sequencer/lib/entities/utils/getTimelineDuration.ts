import type { SerializableTimeline } from '../timeline';
import type { Beats } from '../../../../core/lib/types';

export const getTimelineDuration = (timeline: SerializableTimeline): Beats => {
  return timeline.duration !== undefined
    ? timeline.duration
    : timeline.clipRanges.reduce((accumulator, current) => {
        return accumulator !== null && current.end > accumulator! ? current.end : accumulator;
      }, 0 as Beats);
};
