import type { SerializableTimeline } from '../timeline';
import type { Note } from '../../../../note/note';
import { getUniqueSchedulingId } from '../../scheduler/utils/getUniqueSchedulingId';
import type { NoteClip } from '../noteClip';
import { getTimelineDuration } from './getTimelineDuration';
import type { Beats, BeatsRange } from '../../../../core/lib/types';
import {
  addToRange,
  createRangeFromDuration,
  getItemsInRange,
  getWrappedRanges,
  subtractFromRange,
} from '../../../../range';

export const getTimelineNotesInRange = (
  range: BeatsRange,
  timeline: SerializableTimeline,
  noteClips: Array<BeatsRange & NoteClip>,
  channelId: string,
  slotId: string,
  timelineLoops: number,
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

        accumulator.push({
          ...noteWithTimelineTime,
          // to easily know if note has been scheduled
          schedulingId,
        });

        return accumulator;
      }, []);
    });
  });
};
