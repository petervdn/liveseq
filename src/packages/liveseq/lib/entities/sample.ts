import type { CommonProps, Disposable, PartialCommonProps } from '../types';
import { createEntries } from '../entries/entries';
import { identity } from '../utils/identity';
import { always } from '../utils/always';
import { noop } from '../utils/noop';

export type SerializableSample = CommonProps & {
  source: string;
};

export type SampleInstance = Disposable<SerializableSample>;

export const createSampleEntries = () => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return createEntries<'samples', SampleInstance, PartialCommonProps<SerializableSample>, {}>(
    'samples',
    (serializable) => {
      return {
        isEnabled: true,
        ...serializable,
        dispose: noop,
      };
    },
    identity,
    always({}),
  );
};
