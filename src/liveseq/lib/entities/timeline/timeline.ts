import type { Clip, Note, Timeline } from '../../project/projectStructure';
import type { MusicTime } from '../../utils/musicTime';
import { getItemsInRange } from '../clip/clip';

export const getTimelineClips = (timeline: Timeline, clips: Array<Clip>) => {
  return timeline.clips.map((clip) => {
    return {
      ...clip,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ...clips.find(({ id }) => clip.clipId === id)!, // todo get rid of non-null assert
    };
  });
};

export const getTimelineNotesInRange = (
  rangeStart: MusicTime,
  rangeEnd: MusicTime,
  clips: Array<{ start: MusicTime; end: MusicTime; duration: MusicTime; notes: Array<Note> }>,
) => {
  const clipsInRange = getItemsInRange(rangeStart, rangeEnd, clips);

  return clipsInRange.flatMap((clip) => {
    return getItemsInRange(rangeStart, rangeEnd, clip.notes);
  });
};
