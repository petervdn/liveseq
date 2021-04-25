import { createLiveseq, useLiveseq, useLiveseqContext, libraryVersion } from '../index';
import { getMockedProps } from './getMockedProps';

// these tests help ensure the public api of the library and of liveseq doesn't change
// we should eventually add type testing as well

it('exports all the public members from index', () => {
  expect(createLiveseq).toBeDefined();
  expect(useLiveseqContext).toBeDefined();
  expect(useLiveseq).toBeDefined();
  expect(libraryVersion).toBeDefined();
});

it('returns an object with the expected keys from createLiveseq', () => {
  const liveseq = createLiveseq(getMockedProps());
  // SELECTORS
  // store
  expect(liveseq.getPlayback).toBeDefined();
  expect(liveseq.getTempo).toBeDefined();
  // core
  expect(liveseq.getScheduleDataWithinRange).toBeDefined();
  expect(liveseq.getProject).toBeDefined();
  expect(liveseq.getAudioContext).toBeDefined();

  // ACTIONS
  // player
  expect(liveseq.play).toBeDefined();
  expect(liveseq.pause).toBeDefined();
  expect(liveseq.stop).toBeDefined();

  // store
  expect(liveseq.setTempo).toBeDefined();

  // entity manager
  // TODO:

  // core
  expect(liveseq.dispose).toBeDefined();
});
