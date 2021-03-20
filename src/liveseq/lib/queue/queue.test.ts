import { applyScenesToQueue, createQueue } from './queue';
import type { Beats } from '../time/time';

export {};

it('applyScenesToQueue', () => {
  const queue = createQueue();
  const entities = {
    slots: {
      slot1: {
        id: 'hello',
        type: 'timelineSlot',
        timelineId: '',
        loops: 0,
      },
      slot2: {
        id: 'hello',
        type: 'timelineSlot',
        timelineId: '',
        loops: 0,
      },
    },
  } as const;

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
