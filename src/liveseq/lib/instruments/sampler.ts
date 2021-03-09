import type { ScheduleNote } from '../player/player';
import { playTick } from '../..';

type Instrument = {
  schedule: (context: AudioContext, notes: Array<ScheduleNote>) => void;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type SamplerProps = {};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createSampler = (props: SamplerProps): Instrument => {
  return {
    schedule: (context: AudioContext, notes: Array<ScheduleNote>) => {
      notes.forEach((note) => {
        playTick(context, note.startTime, note.startTime + note.endTime);
      });
    },
  };
};