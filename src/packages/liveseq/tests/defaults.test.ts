import { createLiveseq } from '../lib/liveseq';
import { createProject } from '../lib/project/project';
import { getMockedProps } from './getMockedProps';

it('has correct defaults', () => {
  const liveseq = createLiveseq(getMockedProps());
  expect(liveseq.getTempo()).toBe(120);
  expect(liveseq.getPlaybackState()).toBe('stop');
  expect(liveseq.getProject()).toEqual(createProject());
  expect(createLiveseq({ project: {} }).getProject()).toEqual(createProject());
});
