import {
  addScenesToQueue,
  applyScenesToQueue,
  createQueue,
  getQueuesWithinRange,
  getSlotsWithinRange,
} from './queue';
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

it('applyScenesToQueue', () => {
  const queue = createQueue();

  // doesn't do anything if array is empty
  expect(applyScenesToQueue([], entities, queue, 0 as Beats)).toEqual(queue);

  // play specific slots
  expect(
    applyScenesToQueue(
      [
        {
          id: 'scene1',
          eventActions: {
            enter: [{ type: 'playSlots', slotIds: ['slot1'] }],
          },
        },
      ],
      entities,
      queue,
      0 as Beats,
    ),
  ).toEqual({
    ...queue,
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
    applyScenesToQueue(
      [
        {
          id: 'scene1',
          eventActions: {
            enter: [{ type: 'playSlots' }],
          },
        },
      ],
      entities,
      queue,
      0 as Beats,
    ),
  ).toEqual({
    ...queue,
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

it('getQueuesWithinRange', () => {
  const queue = addScenesToQueue(
    [
      {
        start: 2 as Beats,
        end: Infinity as Beats,
        sceneId: 'scene1',
      },
    ],
    createQueue(),
  );

  expect(
    getQueuesWithinRange(
      {
        start: 0,
        end: 10,
      } as BeatsRange,
      entities,
      queue,
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
  // without scenes in the queue
  const queue = createQueue();
  queue.playingSlots.push({ slotId: 'slot1', start: 0 as Beats });

  expect(
    getSlotsWithinRange(
      {
        start: 0,
        end: 10,
      } as BeatsRange,
      entities,
      queue,
    ),
  ).toEqual([{ end: 10, slots: [{ slotId: 'slot1', start: 0 }], start: 0 }]);

  // with scenes in the queue
  const queueWithScenes = addScenesToQueue(
    [
      {
        start: 2 as Beats,
        end: Infinity as Beats,
        sceneId: 'scene1',
      },
    ],
    createQueue(),
  );
  expect(
    getSlotsWithinRange(
      {
        start: 0,
        end: 10,
      } as BeatsRange,
      entities,
      queueWithScenes,
    ),
  ).toEqual([
    { start: 0, end: 2, slots: [] },
    { start: 2, end: 10, slots: [{ slotId: 'slot1', start: 2 }] },
  ]);
});
