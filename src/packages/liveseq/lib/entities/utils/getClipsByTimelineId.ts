import type { EntityEntries } from '../entities';

export const getClipsByTimelineId = (entities: EntityEntries, timelineId: string) => {
  const timeline = entities.timelines.get(timelineId);
  return timeline.clipRanges.map((clip) => ({
    ...clip,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ...entities.noteClips.get(clip.noteClipId),
  }));
};
