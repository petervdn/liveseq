import type { Beats } from '../../time/time';
import type { BeatsRange } from '../../time/timeRange';
import type { CommonProps } from '../../liveseq';

export type SerializableTimeline = CommonProps & {
  duration?: Beats; // TODO: what to do if duration is undefined, maybe use Infinity instead or we can derive from its clips
  clips: Array<
    BeatsRange & {
      clipId: string;
    }
  >;
};
export type TimelineEntity = ReturnType<typeof createTimelineEntity>;

// might be the same as config for now but for the sake of consistency and to get the interface used internally
export const createTimelineEntity = (props: SerializableTimeline): SerializableTimeline => {
  return props;
};
