import type { LiveseqEntity, Note } from '../../project/projectStructure';
import { addMusicTime, isInRange, MusicTime } from '../../utils/musicTime';

type CreateNoteClipProps = LiveseqEntity & {
  duration?: MusicTime;
  start: MusicTime;
  end: MusicTime;
  notes: Array<Note>;
};

export const createNoteClip = (props: CreateNoteClipProps) => {
  const getNotesInRange = (start: MusicTime, end: MusicTime) => {
    return props.notes.filter((note) => {
      // is note time (in the timeline) in range
      return isInRange(
        addMusicTime(note.start, props.start),
        addMusicTime(note.end, props.start),
        start,
        end,
      );
    });
  };

  return {
    ...props,
    getNotesInRange,
  };
};
