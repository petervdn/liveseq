import type { BeatsRange } from '../time/beatsRange';
import type { Beats, CommonProps, Disposable } from '../types';
import { createEntries } from '../entries/entries';
import { identity } from '../utils/identity';
import { always } from '../utils/always';
import { noop } from '../utils/noop';

export type SerializableTimeline = CommonProps & {
  duration?: Beats;
  clipRanges: Array<
    BeatsRange & {
      noteClipId: string;
    }
  >;
};
export type TimelineInstance = Disposable<SerializableTimeline>;

export const createTimelineEntries = () => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return createEntries<'timelines', TimelineInstance, SerializableTimeline, {}>(
    'timelines',
    (serializable) => {
      return {
        ...serializable,
        dispose: noop,
      };
    },
    identity,
    always({}),
  );
};
