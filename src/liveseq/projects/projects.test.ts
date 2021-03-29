import { abSwitch } from './abSwitch';

it('abSwitch is correct', () => {
  expect(abSwitch.entities).toEqual({
    channels: [
      {
        id: 'channel_0',
        instrumentId: 'sampler_1',
        name: 'Channel Name',
        slotIds: ['slot_0'],
        type: 'instrumentChannel',
      },
      {
        id: 'channel_1',
        instrumentId: 'sampler_1',
        name: 'Channel Name',
        slotIds: ['slot_1'],
        type: 'instrumentChannel',
      },
    ],
    clips: [
      {
        duration: 4,
        id: 'clip_0',
        name: 'Clip Name',
        notes: [
          { end: 1, id: 'note_0', pitch: 'G5', start: 0, velocity: 0.75 },
          { end: 2, id: 'note_1', pitch: 'G6', start: 1, velocity: 0.75 },
          { end: 3, id: 'note_2', pitch: 'G6', start: 2, velocity: 0.75 },
          { end: 4, id: 'note_3', pitch: 'G6', start: 3, velocity: 0.75 },
        ],
        type: 'noteClip',
      },
      {
        duration: 4,
        id: 'clip_1',
        name: 'Clip Name',
        notes: [
          { end: 1, id: 'note_0', pitch: 'C5', start: 0, velocity: 0.75 },
          { end: 2, id: 'note_1', pitch: 'C4', start: 1, velocity: 0.75 },
          { end: 3, id: 'note_2', pitch: 'C4', start: 2, velocity: 0.75 },
          { end: 4, id: 'note_3', pitch: 'C4', start: 3, velocity: 0.75 },
        ],
        type: 'noteClip',
      },
    ],
    instruments: [],
    samples: [],
    scenes: [
      {
        eventActions: {
          enter: [{ slotIds: ['slotId'], type: 'playSlots' }],
          leave: [{ slotIds: ['slotId'], type: 'stopSlots' }],
        },
        id: 'scene_0',
        name: 'A',
      },
      {
        eventActions: {
          enter: [{ slotIds: ['slotId'], type: 'playSlots' }],
          leave: [{ slotIds: ['slotId'], type: 'stopSlots' }],
        },
        id: 'scene_1',
        name: 'B',
      },
    ],
    slots: [
      { id: 'slot_0', loops: 0, name: 'Slot Name', timelineId: 'timeline_0', type: 'timelineSlot' },
      { id: 'slot_1', loops: 0, name: 'Slot Name', timelineId: 'timeline_1', type: 'timelineSlot' },
    ],
    timelines: [
      {
        clipRanges: [{ clipId: 'clip_0', end: 4, start: 0 }],
        duration: 4,
        id: 'timeline_0',
        name: 'Timeline Name',
      },
      {
        clipRanges: [{ clipId: 'clip_1', end: 4, start: 0 }],
        duration: 4,
        id: 'timeline_1',
        name: 'Timeline Name',
      },
    ],
  });
});
