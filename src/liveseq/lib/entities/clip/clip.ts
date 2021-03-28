import type { NoteClip } from './noteClip';
import type { Entities } from '../entities';
import { createNoteClipEntity } from './noteClip';
import type { OmitId } from '../../types';

// ready to add more later
export type SerializableClip = NoteClip;

export const addClip = (
  entities: Entities,
  props: OmitId<SerializableClip>,
  getId: () => string,
): Entities => {
  const id = getId();

  return {
    ...entities,
    clips: {
      ...entities.clips,
      [id]: createNoteClipEntity({ ...props, id }),
    },
  };
};

export const removeClip = (entities: Entities, clipId: string): Entities => {
  const result = {
    ...entities,
    clips: {
      ...entities.clips,
    },
  };

  delete result.clips[clipId];

  // TODO: search and remove any references by id

  return result;
};
