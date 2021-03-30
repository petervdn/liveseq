import { getAbSwitch } from './abSwitch';

it('abSwitch is correct', () => {
  const abSwitch = getAbSwitch();
  expect(abSwitch.initialState.slotPlaybackState).toEqual({
    activeSceneIds: [],
    playingSlots: [],
    queuedScenes: [
      { end: 4, sceneId: 'scene_0', start: 0 },
      { end: 8, sceneId: 'scene_1', start: 4 },
    ],
  });

  expect(abSwitch.entities).toEqual({
    channels: [
      {
        id: 'channel_0',
        instrumentId: 'instrument_0',
        name: 'Channel Name',
        slotIds: ['slot_0'],
        type: 'instrumentChannel',
      },
      {
        id: 'channel_1',
        instrumentId: 'instrument_1',
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
          { end: 1, id: 'note_4', pitch: 'C5', start: 0, velocity: 0.75 },
          { end: 2, id: 'note_5', pitch: 'C4', start: 1, velocity: 0.75 },
          { end: 3, id: 'note_6', pitch: 'C4', start: 2, velocity: 0.75 },
          { end: 4, id: 'note_7', pitch: 'C4', start: 3, velocity: 0.75 },
        ],
        type: 'noteClip',
      },
    ],
    instruments: [
      { id: 'instrument_0', type: 'samplerInstrument' },
      { id: 'instrument_1', type: 'samplerInstrument' },
    ],
    samples: [],
    scenes: [
      {
        eventActions: {
          enter: [{ slotIds: ['slot_0'], type: 'playSlots' }],
          leave: [{ slotIds: ['slot_0'], type: 'stopSlots' }],
        },
        id: 'scene_0',
        name: 'A',
      },
      {
        eventActions: {
          enter: [{ slotIds: ['slot_1'], type: 'playSlots' }],
          leave: [{ slotIds: ['slot_1'], type: 'stopSlots' }],
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
