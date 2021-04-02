import type { Note } from '../../note/note';
import { createNote } from '../../note/note';
import type { Beats, CommonProps, OmitId } from '../../types';
import type { AddEntity, EntityManagementProps, RemoveEntity } from '../entityManager';
import { getHighestId } from '../../utils/getHighestId';
import { getIdGenerator } from '../../utils/getIdGenerator';

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
// ready to add more later
export type SerializableClip = NoteClip;

// MANAGER
export type NoteClipManager = {
  addNoteClip: AddEntity<Omit<OmitId<SerializableClip>, 'notes'>>;
  removeNoteClip: RemoveEntity;
  addNote: (noteClipId: string, note: Partial<OmitId<Note>>) => string;
};
export const getNoteClipManager = ({
  getEntities,
  addEntity,
  removeEntity,
}: EntityManagementProps): NoteClipManager => {
  // Note is kind of a special thing so we have to do this for the ids so they are unique
  const initialIndex = Object.values(getEntities().noteClips).reduce((accumulator, current) => {
    return Math.max(accumulator, getHighestId(current.notes.map((note) => note.id)));
  }, 0);
  const getNoteId = getIdGenerator('notes', initialIndex);

  return {
    addNoteClip: (clip) => {
      return addEntity((id) => createNoteClipEntity({ ...clip, notes: [], id }));
    },
    removeNoteClip: (noteClipId) => {
      return removeEntity(noteClipId);
    },
    addNote: (noteClipId, note) => {
      // TODO: use update entity
      const entities = getEntities();
      const id = getNoteId();
      const clip = entities.noteClips[noteClipId];
      // mutation!
      clip.notes.push(createNote({ ...note, id }));
      return id;
    },
  };
};
