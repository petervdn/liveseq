import type { Note } from '../../../note/note';
import type { CommonProps, Disposable, PartialCommonProps } from '../types';
import { createEntries } from '../../../entries/entries';
import { identity } from '../../../core/utils/identity';
import { createNote } from '../../../note/note';
import { getIdGenerator } from '../../../entries/idGenerator/getIdGenerator';
import { noop } from '../../../core/utils/noop';
import type { Beats } from '../../../time/types';

export type NoteClip = CommonProps & {
  duration: Beats;
  notes: Array<Note>;
};

export type SerializableClip = PartialCommonProps<NoteClip>;
export type NoteClipInstance = Disposable<NoteClip>;

type ExtraMethods = {
  addNote: (noteClipId: string, note: Partial<Note>) => string;
};

export const createNoteClipEntries = () => {
  const generateId = getIdGenerator('notes');

  return createEntries<'noteClips', NoteClipInstance, SerializableClip, ExtraMethods>(
    'noteClips',
    (serializable) => {
      return {
        isEnabled: true,
        ...serializable,
        dispose: noop,
      };
    },
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
