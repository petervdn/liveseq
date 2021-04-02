import type { BeatsRange } from '../time/beatsRange';
import type { Beats, CommonProps } from '../types';
import { createEntries } from '../entries/entries';
import { identity } from '../utils/identity';
import { always } from '../utils/always';

export type SerializableTimeline = CommonProps & {
  duration?: Beats;
  clipRanges: Array<
    BeatsRange & {
      noteClipId: string;
    }
  >;
};
export type TimelineInstance = SerializableTimeline;

export const createTimelineEntries = () => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return createEntries<'timelines', TimelineInstance, SerializableTimeline, {}>(
    'timelines',
    identity,
    identity,
    always({}),
  );
};
