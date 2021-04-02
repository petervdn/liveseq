import type { Note } from '../note/note';
import type { Beats, CommonProps } from '../types';
import { createEntries } from '../entries/entries';
import { identity } from '../utils/identity';
import { createNote } from '../note/note';
import { getIdGenerator } from '../utils/getIdGenerator';

export type NoteClip = CommonProps & {
  duration: Beats;
  notes: Array<Note>;
};

// TODO: remove
export type SerializableClip = NoteClip;
export type NoteClipInstance = SerializableClip;

type ExtraMethods = {
  addNote: (noteClipId: string, note: Partial<Note>) => string;
};

export const createNoteClipEntries = () => {
  const generateId = getIdGenerator('notes');

  return createEntries<'noteClips', NoteClipInstance, SerializableClip, ExtraMethods>(
    'noteClips',
    identity,
    identity,
    (entries) => {
      return {
        addNote: (noteClipId, note) => {
          const id = generateId();

          entries.update(noteClipId, (clip) => {
            return {
              ...clip,
              notes: [...clip.notes, createNote({ ...note, id })],
            };
          });

          return id;
        },
      };
    },
  );
};
