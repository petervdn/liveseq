import type { NoteClip } from './noteClip';
import { createNoteClipEntity } from './noteClip';
import type { OmitId } from '../../types';
import { createNote, Note } from '../../note/note';
import type { AddEntity, RemoveEntity, EntityManagementProps } from '../entityManager';
import { getIdGenerator } from '../../utils/getIdGenerator';
import { getHighestId } from '../../utils/getHighestId';

// ready to add more later
export type SerializableClip = NoteClip;

// MANAGER
// TODO: move to NoteClip
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
      const entities = getEntities();
      const id = getNoteId();
      const clip = entities.noteClips[noteClipId];
      // mutation!
      clip.notes.push(createNote({ ...note, id }));
      return id;
    },
  };
};
