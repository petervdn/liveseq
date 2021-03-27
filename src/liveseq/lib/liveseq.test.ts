import { createLiveseq, Liveseq, LiveseqProps } from './liveseq';
import type { TimeRange } from './time/timeRange';
import { abSwitch } from '../../projects/abSwitch';

// calling these functions should not cause liveseq to throw
const callLiveseqFunctions = (liveseq: Liveseq) => {
  liveseq.play();
  liveseq.stop();
  liveseq.setTempo(liveseq.getTempo());
  liveseq.getIsPlaying();
  // TODO: add a project config or derive project duration so that this param becomes optional
  liveseq.getScheduleItemsInfo({ start: 0, end: 0 } as TimeRange);
  liveseq.dispose();
};

it("doesn't throw when using its functions on init", () => {
  const propsForTests: Array<LiveseqProps | undefined> = [
    undefined,
    {},
    { project: abSwitch },
    { audioContext: {} as AudioContext },
  ];

  // with no params
  expect(() => {
    propsForTests.forEach((props) => callLiveseqFunctions(createLiveseq(props)));
  }).not.toThrow();
});
