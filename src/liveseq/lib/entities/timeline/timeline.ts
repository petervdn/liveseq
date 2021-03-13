import type { LiveseqEntity } from '../liveseqEntity';
import type { Beats } from '../time/time';
import type { BeatsRange } from '../time/timeRange';

export type Timeline = LiveseqEntity & {
  duration?: Beats; // TODO: what to do if duration is undefined, maybe use Infinity instead or we can derive from its clips
  clips: Array<
    BeatsRange & {
      clipId: string;
    }
  >;
};
