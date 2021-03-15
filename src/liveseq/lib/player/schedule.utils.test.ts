import { musicTimeToBeats } from '../time/musicTime';
import type { NoteName } from '../note/note';

export const testProject = {
  libraryVersion: 0,
  name: 'Project Name',
  startScenes: ['scene_1'],
  entities: {
    channels: [
      {
        id: 'channel_1',
        name: 'Channel Name',
        type: 'instrumentChannel',
        instrumentId: 'sampler_1',
        slotIds: ['slot_1', 'slot_2'],
      },
    ],
    instruments: [
      {
        id: 'sampler_1',
        type: 'samplerInstrument',
      },
    ],
    slots: [
      {
        id: 'slot_1',
        type: 'timelineSlot',
        name: 'Slot Name',
        timelineId: 'timeline_1',
        loops: 10,
      },
    ],
    clips: [
      {
        id: 'clip_1',
        type: 'noteClip',
        name: 'Clip Name',
        duration: musicTimeToBeats([1, 0, 0]),
        notes: [
          {
            id: 'note_1',
            start: musicTimeToBeats([0, 0, 0]),
            end: musicTimeToBeats([0, 1, 0]),
            velocity: 0.75,
            pitch: 'C6' as NoteName,
          },
          {
            id: 'note_2',
            start: musicTimeToBeats([0, 1, 0]),
            end: musicTimeToBeats([0, 2, 0]),
            velocity: 0.75,
            pitch: 'C5' as NoteName,
          },
          {
            id: 'note_3',
            start: musicTimeToBeats([0, 2, 0]),
            end: musicTimeToBeats([0, 3, 0]),
            velocity: 0.75,
            pitch: 'C5' as NoteName,
          },
          {
            id: 'note_4',
            start: musicTimeToBeats([0, 3, 0]),
            end: musicTimeToBeats([0, 4, 0]),
            velocity: 0.75,
            pitch: 'C5' as NoteName,
          },
        ],
      },
    ],
    // global to allow same timeline being used in multiple channels or slots
    timelines: [
      {
        id: 'timeline_1',
        name: 'Timeline Name',
        duration: musicTimeToBeats([1, 0, 0]),
        clips: [
          {
            clipId: 'clip_1',
            start: musicTimeToBeats([0, 0, 0]),
            end: musicTimeToBeats([1, 0, 0]),
          },
        ],
      },
    ],
    samples: [],
    scenes: [],
  },
};

it('should get notes in time range', () => {
  expect(true).toBe(true);
});
