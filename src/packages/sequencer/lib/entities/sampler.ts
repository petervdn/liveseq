import type { CommonProps, Disposable, PartialCommonProps } from '../types';
import { createEntries } from '../../../entries/entries';
import { always } from '../../../core/lib/utils/always';
import type { Instrument } from './instrumentChannel';
import { noop } from '../../../core/lib/utils/noop';

export type SerializableSampler = CommonProps;
export type SamplerInstance = Disposable<Instrument & SerializableSampler>;

export const createSamplerEntries = () => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return createEntries<'samplers', SamplerInstance, PartialCommonProps<SerializableSampler>, {}>(
    'samplers',
    (serializable) => {
      return {
        isEnabled: true,
        ...serializable,
        schedule: () => {
          // TODO: emit stream
          // playTick(audioContext, getFrequency(note.pitch), note.startTime, note.endTime - note.startTime);

          return () => {
            // TODO returns a "cancel" fn
          };
        },
        dispose: noop,
      };
    },
    (props) => {
      const { schedule, ...withoutSchedule } = props;
      return withoutSchedule;
    },
    always({}),
  );
};
