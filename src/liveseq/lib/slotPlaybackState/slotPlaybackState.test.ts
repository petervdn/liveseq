import {
  addScenesToQueue,
  applyScenesToSlotPlaybackState,
  createSlotPlaybackState,
  getSlotPlaybackStatesWithinRange,
  getSlotsWithinRange,
} from './slotPlaybackState';
import type { Beats } from '../time/time';
import type { BeatsRange } from '../time/beatsRange';

export {};

const entities = {
  scenes: {
    scene1: {
      id: 'scene1',
      eventActions: {
        enter: [{ type: 'playSlots', slotIds: ['slot1'] }],
      },
    },
  },
  slots: {
    slot1: {
      id: 'slot1',
      type: 'timelineSlot',
      timelineId: '',
      loops: 0,
    },
    slot2: {
      id: 'slot2',
      type: 'timelineSlot',
      timelineId: '',
      loops: 0,
    },
  },
} as const;

it('applyScenesToSlotPlaybackState', () => {
  const slotPlaybackState = createSlotPlaybackState();

  // doesn't do anything if array is empty
  expect(applyScenesToSlotPlaybackState([], entities, slotPlaybackState, 0 as Beats)).toEqual(
    slotPlaybackState,
  );

  // play specific slots
  expect(
    applyScenesToSlotPlaybackState(
      [
        {
          id: 'scene1',
          eventActions: {
            enter: [{ type: 'playSlots', slotIds: ['slot1'] }],
          },
        },
      ],
      entities,
      slotPlaybackState,
      0 as Beats,
    ),
  ).toEqual({
    ...slotPlaybackState,
    activeSceneIds: ['scene1'],
    playingSlots: [
      {
        slotId: 'slot1',
        start: 0,
      },
    ],
  });

  // play all slots
  expect(
    applyScenesToSlotPlaybackState(
      [
        {
          id: 'scene1',
          eventActions: {
            enter: [{ type: 'playSlots' }],
          },
        },
      ],
      entities,
      slotPlaybackState,
      0 as Beats,
    ),
  ).toEqual({
    ...slotPlaybackState,
    activeSceneIds: ['scene1'],
    playingSlots: [
      {
        slotId: 'slot1',
        start: 0,
      },
      {
        slotId: 'slot2',
        start: 0,
      },
    ],
  });
});

it('getSlotPlaybackStatesWithinRange', () => {
  const slotPlaybackState = addScenesToQueue(
    [
      {
        start: 2 as Beats,
        end: Infinity as Beats,
        sceneId: 'scene1',
      },
    ],
    createSlotPlaybackState(),
  );

  expect(
    getSlotPlaybackStatesWithinRange(
      {
        start: 0,
        end: 10,
      } as BeatsRange,
      entities,
      slotPlaybackState,
    ),
  ).toEqual([
    {
      start: 0,
      end: 2,
      activeSceneIds: [],
      playingSlots: [],
      queuedScenes: [{ end: Infinity, sceneId: 'scene1', start: 2 }],
    },
    {
      start: 2,
      end: 10,
      activeSceneIds: ['scene1'],
      playingSlots: [{ slotId: 'slot1', start: 2 }],
      queuedScenes: [],
    },
  ]);
});

it('getSlotsWithinRange', () => {
  // without scenes in the slotPlaybackState
  const slotPlaybackState = createSlotPlaybackState();
  slotPlaybackState.playingSlots.push({ slotId: 'slot1', start: 0 as Beats });

  expect(
    getSlotsWithinRange(
      {
        start: 0,
        end: 10,
      } as BeatsRange,
      entities,
      slotPlaybackState,
    ),
  ).toEqual([{ end: 10, slots: [{ slotId: 'slot1', start: 0 }], start: 0 }]);

  // with scenes in the slotPlaybackState
  const slotPlaybackStateWithScenes = addScenesToQueue(
    [
      {
        start: 2 as Beats,
        end: Infinity as Beats,
        sceneId: 'scene1',
      },
    ],
    createSlotPlaybackState(),
  );
  expect(
    getSlotsWithinRange(
      {
        start: 0,
        end: 10,
      } as BeatsRange,
      entities,
      slotPlaybackStateWithScenes,
    ),
  ).toEqual([
    { start: 0, end: 2, slots: [] },
    { start: 2, end: 10, slots: [{ slotId: 'slot1', start: 2 }] },
  ]);
});
