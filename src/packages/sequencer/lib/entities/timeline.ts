import type { BeatsRange } from '../../../beatsRange/beatsRange';
import type { CommonProps, Disposable, PartialCommonProps } from '../types';
import { createEntries } from '../../../entries/entries';
import { identity } from '../../../core/utils/identity';
import { always } from '../../../core/utils/always';
import { noop } from '../../../core/utils/noop';
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
