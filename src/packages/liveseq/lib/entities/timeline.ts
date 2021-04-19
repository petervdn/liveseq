import type { BeatsRange } from '../../../time/beatsRange/beatsRange';
import type { CommonProps, Disposable, PartialCommonProps } from '../types';
import { createEntries } from '../entries/entries';
import { identity } from '../utils/identity';
import { always } from '../utils/always';
import { noop } from '../utils/noop';
import type { Beats } from '../../../time/types';

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
  return createEntries<'timelines', TimelineInstance, PartialCommonProps<SerializableTimeline>, {}>(
    'timelines',
    (serializable) => {
      return {
        ...serializable,
        isEnabled: true,
        dispose: noop,
      };
    },
    identity,
    always({}),
  );
};
