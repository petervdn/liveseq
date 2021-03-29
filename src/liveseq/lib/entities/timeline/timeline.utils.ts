import type { SerializableTimeline } from './timeline';
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

export const getTimelineDuration = (timeline: SerializableTimeline): Beats => {
  return timeline.duration !== undefined
    ? timeline.duration
    : timeline.clipRanges.reduce((accumulator, current) => {
        return accumulator !== null && current.end > accumulator! ? current.end : accumulator;
      }, 0 as Beats);
};

export const getTimelineNotesInRange = (
  range: BeatsRange,
  timeline: SerializableTimeline,
  clips: Array<BeatsRange & { id: string; duration: Beats; notes: Array<Note> }>, // todo: this isnt a clip?
  channelId: string,
  slotId: string,
  timelineLoops: number,
  previouslyScheduledNoteIds: Array<string>,
) => {
  const timelineRange = createRangeFromDuration(getTimelineDuration(timeline));
  const loopedRanges = getWrappedRanges(range, timelineRange, timelineLoops);

  return loopedRanges.flatMap((loopedRange) => {
    const clipsInRange = getItemsInRange(loopedRange, clips);
    return clipsInRange.flatMap((clip) => {
      const localRange = subtractFromRange(loopedRange, clip.start);

      return getItemsInRange(localRange, clip.notes).reduce<Array<Note & { schedulingId: string }>>(
        (accumulator, note) => {
          // adjust note timing
          const noteWithTimelineTime = addToRange(note, (clip.start + loopedRange.offset) as Beats);

          const schedulingId = getUniqueSchedulingId({
            noteId: note.id,
            start: noteWithTimelineTime.start,
            channelId,
            slotId,
            clipId: clip.id,
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
        },
        [],
      );
    });
  });
};
