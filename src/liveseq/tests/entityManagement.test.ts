import { createLiveseq } from '..';

it('adds instrument channels', () => {
  const liveseq = createLiveseq();

  liveseq.addChannel({
    type: 'instrumentChannel',
    instrumentId: liveseq.addInstrument({
      type: 'samplerInstrument',
    }),
    slotIds: [],
  });

  expect(liveseq.getProject()).toEqual({
    name: 'untitled',
    libraryVersion: 0,
    initialState: { slotPlaybackState: { activeSceneIds: [], playingSlots: [], queuedScenes: [] } },
    entities: {
      channels: [
        { id: 'channel_0', instrumentId: 'instrument_0', slotIds: [], type: 'instrumentChannel' },
      ],
      clips: [],
      instruments: [{ id: 'instrument_0', type: 'samplerInstrument' }],
      samples: [],
      scenes: [],
      slots: [],
      timelines: [],
    },
  });
});
