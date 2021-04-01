import type { NoteClip } from './noteClip';
import { createNoteClipEntity } from './noteClip';
import type { OmitId } from '../../types';
import { createNote, Note } from '../../note/note';
import type { AddEntity, RemoveEntity, EntityManagementProps } from '../entityManager';
import { getIdGenerator } from '../../utils/getIdGenerator';

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
  // TODO: improve this or maybe use uuid generator... or promote to entity
  const getNoteId = getIdGenerator('notes', 0);

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
