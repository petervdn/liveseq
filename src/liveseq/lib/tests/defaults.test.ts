import { createLiveseq } from '../liveseq';
import { libraryVersion } from '../../libraryVersion';

it('has correct defaults', () => {
  expect(createLiveseq().getTempo()).toBe(120);
  expect(createLiveseq().audioContext).toBeDefined();
  expect(createLiveseq().getIsPlaying()).toBe(false);
  expect(createLiveseq().getProject()).toEqual({
    name: 'untitled',
    libraryVersion,
    initialState: { slotPlaybackState: { activeSceneIds: [], playingSlots: [], queuedScenes: [] } },
    entities: {
      channels: [],
      clips: [],
      instruments: [],
      samples: [],
      scenes: [],
      slots: [],
      timelines: [],
    },
  });
});
