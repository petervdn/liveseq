import type { SerializableTimeline } from '../timeline';
import type { Note } from '../../note/note';
import { getUniqueSchedulingId } from '../../player/getUniqueSchedulingId';
import type { BeatsRange } from '../../time/beatsRange';
import {
  addToRange,
  createRangeFromDuration,
  getItemsInRange,
  getWrappedRanges,
  subtractFromRange,
} from '../../time/beatsRange';
import type { Beats } from '../../types';
import type { NoteClip } from '../noteClip';

const getTimelineDuration = (timeline: SerializableTimeline): Beats => {
  return timeline.duration !== undefined
    ? timeline.duration
    : timeline.clipRanges.reduce((accumulator, current) => {
        return accumulator !== null && current.end > accumulator! ? current.end : accumulator;
      }, 0 as Beats);
};

export const getTimelineNotesInRange = (
  range: BeatsRange,
  timeline: SerializableTimeline,
  noteClips: Array<BeatsRange & NoteClip>,
  channelId: string,
  slotId: string,
  timelineLoops: number,
  previouslyScheduledNoteIds: Array<string>,
) => {
  const timelineRange = createRangeFromDuration(getTimelineDuration(timeline));
  const loopedRanges = getWrappedRanges(range, timelineRange, timelineLoops);

  return loopedRanges.flatMap((loopedRange) => {
    const clipsInRange = getItemsInRange(loopedRange, noteClips);
    return clipsInRange.flatMap((noteClip) => {
      const localRange = subtractFromRange(loopedRange, noteClip.start);

      return getItemsInRange(localRange, noteClip.notes).reduce<
        Array<Note & { schedulingId: string }>
      >((accumulator, note) => {
        // adjust note timing
        const noteWithTimelineTime = addToRange(
          note,
          (noteClip.start + loopedRange.offset) as Beats,
        );

        const schedulingId = getUniqueSchedulingId({
          noteId: note.id,
          start: noteWithTimelineTime.start,
          channelId,
          slotId,
          noteClipId: noteClip.id,
        });

        const hasBeenScheduled = previouslyScheduledNoteIds.includes(schedulingId);

        if (!hasBeenScheduled) {
          accumulator.push({
            ...noteWithTimelineTime,
            // to easily know if note has been scheduled
            schedulingId,
          });
        }

        return accumulator;
      }, []);
    });
  });
};
