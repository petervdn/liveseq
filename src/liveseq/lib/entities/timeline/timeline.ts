import type { BeatsRange } from '../../time/beatsRange';
import type { Beats, CommonProps, OmitId } from '../../types';
import type { AddEntity, EntityManagementProps, RemoveEntity } from '../entityManager';

export type SerializableTimeline = CommonProps & {
  duration?: Beats;
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

// MANAGER
export type TimelineManager = {
  addTimeline: AddEntity<OmitId<SerializableTimeline>>;
  removeTimeline: RemoveEntity;
};

export const getTimelineManager = ({
  addEntity,
  removeEntity,
}: EntityManagementProps): TimelineManager => {
  return {
    addTimeline: (timeline) => {
      return addEntity((id) => createTimelineEntity({ ...timeline, id }));
    },
    removeTimeline: (timelineId) => {
      removeEntity(timelineId);

      // TODO: search and remove any references by id
    },
  };
};
