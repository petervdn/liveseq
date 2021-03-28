import { createLiveseq } from '../lib/liveseq';
import { createProject } from '../lib/project/project';

it('has correct defaults', () => {
  expect(createLiveseq().getTempo()).toBe(120);
  expect(createLiveseq().getIsPlaying()).toBe(false);
  expect(createLiveseq().getIsPaused()).toBe(true);
  expect(createLiveseq().getIsStopped()).toBe(true);
  expect(createLiveseq().getProject()).toEqual(createProject());
  expect(createLiveseq({ project: {} }).getProject()).toEqual(createProject());
});
