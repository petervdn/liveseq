import { createLiveseq } from '../lib/liveseq';
import { createProject } from '../lib/project/project';

it('has correct defaults', () => {
  const liveseq = createLiveseq();
  expect(liveseq.getTempo()).toBe(120);
  expect(liveseq.getIsPlaying()).toBe(false);
  expect(liveseq.getIsPaused()).toBe(false);
  expect(liveseq.getIsStopped()).toBe(true);
  expect(liveseq.getProject()).toEqual(createProject());
  expect(createLiveseq({ project: {} }).getProject()).toEqual(createProject());
});
