import type { SerializableTimeline } from './timeline';
import type { Beats } from '../../time/time';
import type { Note } from '../../note/note';
import {
  addToRange,
  createRangeFromDuration,
  getItemsInRange,
  getWrappedRanges,
  subtractFromRange,
} from '../../time/timeRange.utils';
import type { BeatsRange } from '../../time/timeRange';
import { getUniqueSchedulingId } from '../../player/getUniqueSchedulingId';

export const getTimelineDuration = (timeline: SerializableTimeline): Beats => {
  return timeline.duration !== undefined
    ? timeline.duration
    : timeline.clips.reduce((accumulator, current) => {
        return accumulator !== null && current.end > accumulator! ? current.end : accumulator;
      }, 0 as Beats);
};

export const getTimelineLength = (timeline: SerializableTimeline, loops = 0): Beats => {
  return (getTimelineDuration(timeline) * (loops + 1)) as Beats;
};

// TODO: these returned notes need ids. The ids must be unique for every timeline loop
// TODO: account for duration
export const getTimelineNotesInRange = (
  range: BeatsRange,
  timeline: SerializableTimeline,
  clips: Array<BeatsRange & { id: string; duration: Beats; notes: Array<Note> }>, // todo: this isnt a clip?
  channelId: string,
  slotId: string,
  timelineLoops = 0,
) => {
  const clipsInRange = getItemsInRange(range, clips);
  const timelineRange = createRangeFromDuration(getTimelineDuration(timeline));
  const loopedRanges = getWrappedRanges(range, timelineRange, timelineLoops);

  return clipsInRange.flatMap((clip) => {
    return loopedRanges.flatMap((loopedRange, iteration) => {
      const localRange = subtractFromRange(loopedRange, clip.start);

      return getItemsInRange(localRange, clip.notes).map((note) => {
        // adjust note timing
        const noteWithTimelineTime = addToRange(
          note,
          (clip.start + clip.duration * iteration) as Beats,
        );

        return {
          ...noteWithTimelineTime,
          // to easily know if note has been scheduled
          schedulingId: getUniqueSchedulingId({
            noteId: note.id,
            iteration,
            channelId,
            slotId,
            clipId: clip.id,
          }),
        };
      });
    });
  });
};
