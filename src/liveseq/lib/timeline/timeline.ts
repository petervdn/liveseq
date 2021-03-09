import type { Clip, Timeline } from '../project/projectStructure';
import type { MusicTime } from '../utils/musicTime';
import { addMusicTime, isInRange } from '../utils/musicTime';

export const createTimeline = (timeline: Timeline, clips: Array<Clip>) => {
  // select only the ones used in this timeline
  const timelineClips = timeline.clips.map((clip) => {
    return {
      ...clip,
      ...clips.find(({ id }) => clip.clipId === id)!,
    };
  });

  // export const isPlayingAt = curry((time: number, note: Note): boolean => {
  //   return (
  //     note.time <= time && note.time + note.duration >= time && note.duration > start
  //   );
  // });

  // get all clips that have start time < end and end > start
  const getClipsInRange = (start: MusicTime, end: MusicTime) => {
    return timelineClips.filter((clip) => isInRange(clip.start, clip.end, start, end));
  };

  // TODO: move to a fn called createClip
  const getNotesInRange = (start: MusicTime, end: MusicTime) => {
    const clipsInRange = getClipsInRange(start, end);
    return clipsInRange.flatMap((clip) => {
      return clip.notes.filter((note) => {
        // is note time (in the timeline) in range
        return isInRange(
          addMusicTime(note.start, clip.start),
          addMusicTime(note.end, clip.start),
          start,
          end,
        );
      });
    });
  };

  return { getClipsInRange, getNotesInRange };
};
