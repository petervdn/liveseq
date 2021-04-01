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
export type ClipManager = {
  addClip: AddEntity<OmitId<SerializableClip>>;
  removeClip: RemoveEntity;
  addNoteToClip: (clipId: string, note: Partial<OmitId<Note>>) => string;
};

export const getClipManager = ({
  getEntities,
  addEntity,
  removeEntity,
}: EntityManagementProps): ClipManager => {
  // Note is kind of a special thing so we have to do this for the ids so they are unique
  const initialIndex = Object.values(getEntities().clips).reduce((accumulator, current) => {
    return Math.max(accumulator, getHighestId(current.notes.map((note) => note.id)));
  }, 0);
  const getNoteId = getIdGenerator('notes', initialIndex);

  return {
    addClip: (clip) => {
      return addEntity((id) => createNoteClipEntity({ ...clip, id }));
    },
    removeClip: (clipId) => {
      return removeEntity(clipId);
    },
    addNoteToClip: (clipId, note) => {
      const entities = getEntities();
      const id = getNoteId();
      const clip = entities.clips[clipId];
      // mutation!
      clip.notes.push(createNote({ ...note, id }));
      return id;
    },
  };
};
