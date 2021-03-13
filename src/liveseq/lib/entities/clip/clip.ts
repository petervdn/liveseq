import type { LiveseqEntity } from '../liveseqEntity';
import type { Beats } from '../time/time';
import type { Note } from '../note/note';

export type NoteClip = LiveseqEntity & {
  type: 'noteClip';
  duration: Beats;
  notes: Array<Note>;
};

// ready to add more later
export type Clip = NoteClip;
