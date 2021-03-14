import type { ScheduleNote } from '../../player/player';
import { playTick } from '../../utils/playTick';
import type { LiveseqEntity } from '../liveseqEntity';
import { getFrequency } from '../../note/note';
import type { InstrumentInstance } from './instrument';

export type SamplerInstrument = LiveseqEntity & {
  type: 'samplerInstrument';
};

// eslint-disable-next-line @typescript-eslint/ban-types
type SamplerProps = {};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createSampler = (props: SamplerProps): InstrumentInstance => {
  return {
    schedule: (context: AudioContext, notes: Array<ScheduleNote>) => {
      notes.forEach((note) => {
        playTick(context, getFrequency(note.pitch), note.startTime, note.endTime - note.startTime);
      });
    },
  };
};
