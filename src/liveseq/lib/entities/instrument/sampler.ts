import type { ScheduleNote } from '../../player/player';
import { playTick } from '../../utils/playTick';

import { getFrequency } from '../../note/note';
import type { InstrumentInstance } from './instrument';
import type { CommonProps } from '../../types';

export type SamplerInstrument = CommonProps & {
  type: 'samplerInstrument';
};

export type SamplerEntity = InstrumentInstance & SamplerInstrument;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createSamplerEntity = (
  audioContext: AudioContext,
  props: SamplerInstrument,
): SamplerEntity => {
  return {
    ...props,
    schedule: (notes: Array<ScheduleNote>) => {
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
