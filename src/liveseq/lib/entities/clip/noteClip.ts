import type { Beats } from '../../time/time';
import type { Note } from '../../note/note';
import type { CommonProps } from '../../liveseq';

export type NoteClip = CommonProps & {
  type: 'noteClip';
  duration: Beats;
  notes: Array<Note>;
};

export type NoteClipEntity = ReturnType<typeof createNoteClipEntity>;

// might be the same as config for now but for the sake of consistency and to get the interface used internally
export const createNoteClipEntity = (props: NoteClip): NoteClip => {
  return props;
};
