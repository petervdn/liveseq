import type { Beats } from '../lib/types';
import { createLiveseq } from '..';
import { playSlots } from '../lib/entities/scene';
import type { BeatsRange } from '../lib/time/beatsRange';

it('getSlotPlaybackStatesWithinRange', () => {
  const liveseq = createLiveseq();
  const slotPlaybackState = liveseq.getProject().initialState.slotPlaybackState!;

  // doesn't do anything if array is empty
  expect(slotPlaybackState).toEqual({ activeSceneIds: [], playingSlots: [], queuedScenes: [] });

  // play specific slots
  // TODO: slot1 doesn't exist but there was no error, there should be one
  const sceneIdA = liveseq.scenes.create({ enter: [playSlots(['slot1'])] });
  liveseq.addSceneToQueue({
    start: 0 as Beats,
    end: Infinity as Beats,
    sceneId: sceneIdA,
  });

  expect(liveseq.getSlotPlaybackStatesWithinRange({ start: 0, end: 4 } as BeatsRange)).toEqual([
    {
      start: 0,
      end: 4,
      activeSceneIds: [sceneIdA],
      playingSlots: [{ slotId: 'slot1', start: 0 }],
      queuedScenes: [],
    },
  ]);

  const sceneIdB = liveseq.scenes.create({ enter: [playSlots()] });
  liveseq.addSceneToQueue({
    start: 2 as Beats,
    end: Infinity as Beats,
    sceneId: sceneIdB,
  });

  expect(liveseq.getSlotPlaybackStatesWithinRange({ start: 0, end: 4 } as BeatsRange)).toEqual([
    {
      activeSceneIds: ['scenes_0'],
      end: 2,
      playingSlots: [{ slotId: 'slot1', start: 0 }],
      queuedScenes: [{ end: Infinity, sceneId: 'scenes_1', start: 2 }],
      start: 0,
    },
    {
      activeSceneIds: ['scenes_1'],
      end: 4,
      playingSlots: [
        { slotId: 'slot1', start: 0 },
        { slotId: 'get', start: 2 },
        { slotId: 'getRecord', start: 2 },
        { slotId: 'add', start: 2 },
        { slotId: 'remove', start: 2 },
        { slotId: 'update', start: 2 },
        { slotId: 'enable', start: 2 },
        { slotId: 'disable', start: 2 },
        { slotId: 'create', start: 2 },
        { slotId: 'encode', start: 2 },
        { slotId: 'dispose', start: 2 },
      ],
      queuedScenes: [],
      start: 2,
    },
  ]);
});