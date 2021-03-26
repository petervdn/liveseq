/* eslint-disable @typescript-eslint/naming-convention */
import type { Opaque } from 'type-fest';
import type { BeatsRange } from '../time/beatsRange';
import type { Beats } from '../time/time';

export type Hertz = Opaque<number, 'Hertz'>;

export type NoteName = keyof typeof offsets;

export type Note = BeatsRange & {
  id: string;
  velocity: number;
  pitch: NoteName;
};

const defaultNote: Note = {
  id: '',
  start: 0 as Beats,
  end: 1 as Beats,
  velocity: 0.75,
  pitch: 'C5' as NoteName,
};

export const createNote = (note: Partial<Note>) => {
  return {
    ...defaultNote,
    ...note,
  };
};

// the frequency of the middle C (C4)
export const middleC = (440 * Math.pow(Math.pow(2, 1 / 12), -9)) as Hertz;
// the octave number of our known frequency, middle C (C4)
const octaveOffset = 4;

export const offsets = {
  'B#': 0,
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  Fb: 4,
  'E#': 5,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
  Cb: 11,
};

export const getFrequency = (name: NoteName): Hertz => {
  const couple = name.split(/(\d+)/);
  const distance = offsets[couple[0] as NoteName];
  const octaveDiff = (parseInt(couple[1], 10) || octaveOffset) - octaveOffset;
  const freq = middleC * Math.pow(Math.pow(2, 1 / 12), distance);
  return (freq * Math.pow(2, octaveDiff)) as Hertz;
};
