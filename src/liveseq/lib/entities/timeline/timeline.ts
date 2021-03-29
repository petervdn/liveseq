import type { BeatsRange } from '../../time/beatsRange';
import type { Entities } from '../entities';
import type { Beats, CommonProps, OmitId } from '../../types';

export type SerializableTimeline = CommonProps & {
  duration?: Beats; // TODO: what to do if duration is undefined, maybe use Infinity instead or we can derive from its clips
  clipRanges: Array<
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

export const addTimeline = (
  entities: Entities,
  props: OmitId<SerializableTimeline>,
  id: string,
): Entities => {
  return {
    ...entities,
    timelines: {
      ...entities.timelines,
      [id]: createTimelineEntity({ ...props, id }),
    },
  };
};

export const removeTimeline = (entities: Entities, timelineId: string): Entities => {
  const result = {
    ...entities,
    timelines: {
      ...entities.timelines,
    },
  };

  delete result.timelines[timelineId];

  // TODO: search and remove any references by id

  return result;
};
