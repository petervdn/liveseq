import type { Entities } from '../entities';

export const getClipsByTimelineId = (
  entities: Pick<Entities, 'timelines' | 'noteClips'>,
  timelineId: string,
) => {
  const timeline = entities.timelines.get(timelineId);
  return timeline.clipRanges.map((clip) => ({
    ...clip,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ...entities.noteClips.get(clip.noteClipId),
  }));
};