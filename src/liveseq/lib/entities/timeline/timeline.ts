import type { Clip, Note, Timeline } from '../../project/projectStructure';
import type { MusicTime } from '../../utils/musicTime';
import type { MusicTimeRange } from '../../utils/musicTimeRange';
import { addToRange, getItemsInRange, subtractFromRange } from '../../utils/musicTimeRange';

export const getTimelineClips = (timeline: Timeline, clips: Array<Clip>) => {
  return timeline.clips.map((clip) => {
    return {
      ...clip,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ...clips.find(({ id }) => clip.clipId === id)!, // todo get rid of non-null assert
    };
  });
};

// useful to "infer" timeline length from its clips
// export const getLastClipEnd = (
//   clips: Array<MusicTimeRange & { duration: MusicTime; notes: Array<Note> }>,
// ): MusicTime => {};

// gets a note and "what loop" it's in and returns a unique id based on its properties, current repetition and channel
export const getLoopNoteId = (note: Note, channelId: string, repetition: number) => {
  return JSON.stringify({
    pitch: note.pitch,
    repetition,
    start: note.start,
    end: note.end,
    channelId,
  });
};

// TODO: these returned notes need ids. The ids must be unique for every timeline loop
// TODO: account for duration
export const getTimelineNotesInRange = (
  musicTimeRange: MusicTimeRange,
  timeline: Timeline,
  clips: Array<MusicTimeRange & { duration: MusicTime; notes: Array<Note> }>,
  channelId: string,
  // timelineLoops? = 1,
) => {
  const clipsInRange = getItemsInRange(musicTimeRange, clips);

  const notesInRange = clipsInRange.flatMap((clip) => {
    const localRange = subtractFromRange(musicTimeRange, clip.start);

    return getItemsInRange(localRange, clip.notes).map((note) => {
      const noteWithTimelineTime = addToRange(note, clip.start);

      return {
        ...noteWithTimelineTime,
        // to easily know if note has been scheduled...
        // could also just add a property with the current repetition but the start and end change so it would be confusing
        schedulingId: getLoopNoteId(noteWithTimelineTime, channelId, 0),
      };
    });
  });

  return notesInRange;
};
