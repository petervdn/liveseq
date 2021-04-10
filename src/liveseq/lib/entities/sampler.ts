import { playTick } from '../utils/playTick';
import { getFrequency } from '../note/note';
import type { CommonProps, Disposable } from '../types';
import { createEntries } from '../entries/entries';
import { always } from '../utils/always';
import type { Instrument } from './instrumentChannel';
import { noop } from '../utils/noop';

export type SerializableSampler = CommonProps;
export type SamplerInstance = Disposable<Instrument & SerializableSampler>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const decode = (serializable: SerializableSampler): SamplerInstance => {
  return {
    ...serializable,
    schedule: (note, mixer) => {
      playTick(mixer, getFrequency(note.pitch), note.startTime, note.endTime - note.startTime);

      return () => {
        // TODO returns a "cancel" fn
      };
    },
    dispose: noop,
  };
};

export const encode = (props: SamplerInstance): SerializableSampler => {
  const { schedule, ...withoutSchedule } = props;
  return withoutSchedule;
};

export const createSamplerEntries = () => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return createEntries<'samplers', SamplerInstance, SerializableSampler, {}>(
    'samplers',
    decode,
    encode,
    always({}),
  );
};
