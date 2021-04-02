import { createLiveseq, useLiveseq, useLiveseqContext, libraryVersion } from '..';

// these tests help ensure the public api of the library and of liveseq doesn't change
// we should eventually add type testing as well

it('exports all the public members from index', () => {
  expect(createLiveseq).toBeDefined();
  expect(useLiveseqContext).toBeDefined();
  expect(useLiveseq).toBeDefined();
  expect(libraryVersion).toBeDefined();
});

it('returns an object with the expected keys from createLiveseq', () => {
  const liveseq = createLiveseq();
  // SELECTORS
  // store
  expect(liveseq.getIsPlaying).toBeDefined();
  expect(liveseq.getIsPaused).toBeDefined();
  expect(liveseq.getIsStopped).toBeDefined();
  expect(liveseq.getTempo).toBeDefined();
  expect(liveseq.getIsMuted).toBeDefined();
  // core
  expect(liveseq.getScheduleItemsInfo).toBeDefined();
  expect(liveseq.getProject).toBeDefined();
  expect(liveseq.getAudioContext).toBeDefined();

  // ACTIONS
  // player
  expect(liveseq.play).toBeDefined();
  expect(liveseq.pause).toBeDefined();
  expect(liveseq.stop).toBeDefined();

  // store
  expect(liveseq.setTempo).toBeDefined();
  expect(liveseq.setIsMuted).toBeDefined();

  // entity manager
  expect(liveseq.addInstrumentChannel).toBeDefined();
  expect(liveseq.removeInstrumentChannel).toBeDefined();
  expect(liveseq.addNoteClip).toBeDefined();
  expect(liveseq.removeNoteClip).toBeDefined();
  expect(liveseq.addInstrument).toBeDefined();
  expect(liveseq.removeInstrument).toBeDefined();
  expect(liveseq.addSample).toBeDefined();
  expect(liveseq.removeSample).toBeDefined();
  expect(liveseq.addScene).toBeDefined();
  expect(liveseq.removeScene).toBeDefined();
  expect(liveseq.addSlot).toBeDefined();
  expect(liveseq.removeSlot).toBeDefined();
  expect(liveseq.addTimeline).toBeDefined();
  expect(liveseq.removeTimeline).toBeDefined();

  // core
  expect(liveseq.dispose).toBeDefined();
});
