import type { Clip, LiveseqEntity, Note, Timeline } from '../project/projectStructure';
import type { MusicTime } from '../utils/musicTime';
import { addMusicTime, isInRange } from '../utils/musicTime';

type CreateNoteClipProps = LiveseqEntity & {
  duration?: MusicTime;
  start: MusicTime;
  end: MusicTime;
  notes: Array<Note>;
};

const createClip = (props: CreateNoteClipProps) => {
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

export const createTimeline = (timeline: Timeline, clips: Array<Clip>) => {
  const clipInstances = timeline.clips
    .map((clip) => {
      return {
        ...clip,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...clips.find(({ id }) => clip.clipId === id)!, // todo get rid of non-null assert
      };
    })
    .map(createClip);

  const getClipsInRange = (start: MusicTime, end: MusicTime) => {
    return clipInstances.filter((clip) => isInRange(clip.start, clip.end, start, end));
  };

  const getNotesInRange = (start: MusicTime, end: MusicTime) => {
    return getClipsInRange(start, end).flatMap((clipInstance) => {
      return clipInstance.getNotesInRange(start, end);
    });
  };

  return { getClipsInRange, getNotesInRange };
};
