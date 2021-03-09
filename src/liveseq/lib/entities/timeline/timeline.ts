import type { Clip, Timeline } from '../../project/projectStructure';
import type { MusicTime } from '../../utils/musicTime';
import { isInRange } from '../../utils/musicTime';
import { createNoteClip } from '../clip/noteClip';

export const createTimeline = (timeline: Timeline, clips: Array<Clip>) => {
  const clipInstances = timeline.clips.map((clip) => {
    return createNoteClip({
      ...clip,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ...clips.find(({ id }) => clip.clipId === id)!, // todo get rid of non-null assert
    });
  });

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
