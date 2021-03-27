import type { Liveseq } from '../liveseq';
import type { TimeRange } from '../time/timeRange';

// calling these functions should not cause liveseq to throw
export const isStable = (liveseq: Liveseq, mutate = false) => {
  liveseq.play();
  liveseq.stop();
  liveseq.setTempo(liveseq.getTempo());
  liveseq.getIsPlaying();
  liveseq.getProject();
  // TODO: add a project config or derive project duration so that this param becomes optional
  liveseq.getScheduleItemsInfo({ start: 0, end: 0 } as TimeRange);
  mutate && liveseq.dispose();
};
