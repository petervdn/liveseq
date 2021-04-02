import type { ScheduleNote } from '../player/player';
import { playTick } from '../utils/playTick';
import { getFrequency } from '../note/note';
import type { CommonProps } from '../types';
import { createEntries } from '../entries/entries';
import { always } from '../utils/always';

export type SerializableSampler = CommonProps;

// TODO: when we have more samplers this needs to be moved to a general place
export type InstrumentInstance = {
  schedule: (notes: Array<ScheduleNote>, audioContext: AudioContext) => void;
};

export type SamplerInstance = InstrumentInstance & SerializableSampler;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const decode = (props: SerializableSampler): SamplerInstance => {
  return {
    ...props,
    schedule: (notes: Array<ScheduleNote>, audioContext: AudioContext) => {
      notes.forEach((note) => {
        // eslint-disable-next-line no-console
        console.log('scheduling', note.schedulingId);
        playTick(
          audioContext,
          getFrequency(note.pitch),
          note.startTime,
          note.endTime - note.startTime,
        );
      });
    },
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
