import type { ScheduleNote } from '../../player/player';
import { playTick } from '../../utils/playTick';

import { getFrequency } from '../../note/note';
import type { InstrumentInstance } from './instrument';
import type { CommonProps } from '../../liveseq';

export type SamplerInstrument = CommonProps & {
  type: 'samplerInstrument';
};

export type SamplerEntity = InstrumentInstance & SamplerInstrument;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createSamplerEntity = (props: SamplerInstrument): SamplerEntity => {
  return {
    ...props,
    schedule: (context: AudioContext, notes: Array<ScheduleNote>) => {
      notes.forEach((note) => {
        playTick(context, getFrequency(note.pitch), note.startTime, note.endTime - note.startTime);
      });
    },
  };
};
