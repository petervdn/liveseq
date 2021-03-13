import type { Timeline } from './timeline';
import type { Beats } from '../../time/time';
import type { Note } from '../../note/note';
import type { Clip } from '../clip/clip';
import {
  addToRange,
  createRangeFromDuration,
  getItemsInRange,
  getWrappedRanges,
  subtractFromRange,
} from '../../time/timeRange.utils';
import type { BeatsRange } from '../../time/timeRange';

export const getTimelineClips = (timeline: Timeline, clips: Array<Clip>) =>
  timeline.clips.map((clip) => ({
    ...clip,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ...clips.find(({ id }) => clip.clipId === id)!, // todo get rid of non-null assert
  }));

export const getTimelineDuration = (timeline: Timeline): Beats =>
  timeline.duration !== undefined
    ? timeline.duration
    : timeline.clips.reduce((accumulator, current) => {
        return accumulator !== null && current.end > accumulator! ? current.end : accumulator;
      }, 0 as Beats);

export const getTimelineLength = (timeline: Timeline, loops = 0): Beats =>
  (getTimelineDuration(timeline) * (loops + 1)) as Beats;

// the props that make a note be considered the same note to the scheduler
export type UniqueSchedulingIdProps = {
  iteration: number;
  noteId: string;
  channelId: string;
  slotId: string;
  clipId: string;
};

export const getUniqueSchedulingId = (props: UniqueSchedulingIdProps) => JSON.stringify(props);

// TODO: these returned notes need ids. The ids must be unique for every timeline loop
// TODO: account for duration
export const getTimelineNotesInRange = (
  range: BeatsRange,
  timeline: Timeline,
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
        const noteWithTimelineTime = addToRange(note, clip.start);

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
