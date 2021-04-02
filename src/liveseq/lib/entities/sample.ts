import type { CommonProps } from '../types';
import { createEntries } from '../entries/entries';
import { identity } from '../utils/identity';
import { always } from '../utils/always';

export type SerializableSample = CommonProps & {
  source: string;
};

export type SampleInstance = SerializableSample;

export const createSampleEntries = () => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return createEntries<'samples', SampleInstance, SerializableSample, {}>(
    'samples',
    identity,
    identity,
    always({}),
  );
};
