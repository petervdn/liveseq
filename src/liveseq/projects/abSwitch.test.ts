import { getAbSwitch } from './abSwitch';

it('abSwitch is correct', () => {
  const abSwitch = getAbSwitch();
  expect(abSwitch).toEqual({
    name: 'abSwitch',
    libraryVersion: 0,
    initialState: {
      slotPlaybackState: {
        activeSceneIds: [],
        playingSlots: [],
        queuedScenes: [
          { end: 4, sceneId: 'scenes_0', start: 0 },
          { end: 8, sceneId: 'scenes_1', start: 4 },
        ],
      },
    },
    entities: {
      channels: [
        {
          id: 'channels_0',
          instrumentId: 'instruments_0',
          name: 'Channel Name',
          slotIds: ['slots_0'],
          type: 'instrumentChannel',
        },
        {
          id: 'channels_1',
          instrumentId: 'instruments_1',
          name: 'Channel Name',
          slotIds: ['slots_1'],
          type: 'instrumentChannel',
        },
      ],
      clips: [
        {
          duration: 4,
          id: 'clips_0',
          name: 'Clip Name',
          notes: [
            { end: 1, id: 'notes_0', pitch: 'G5', start: 0, velocity: 0.75 },
            { end: 2, id: 'notes_1', pitch: 'G6', start: 1, velocity: 0.75 },
            { end: 3, id: 'notes_2', pitch: 'G6', start: 2, velocity: 0.75 },
            { end: 4, id: 'notes_3', pitch: 'G6', start: 3, velocity: 0.75 },
          ],
          type: 'noteClip',
        },
        {
          duration: 4,
          id: 'clips_1',
          name: 'Clip Name',
          notes: [
            { end: 1, id: 'notes_4', pitch: 'C5', start: 0, velocity: 0.75 },
            { end: 2, id: 'notes_5', pitch: 'C4', start: 1, velocity: 0.75 },
            { end: 3, id: 'notes_6', pitch: 'C4', start: 2, velocity: 0.75 },
            { end: 4, id: 'notes_7', pitch: 'C4', start: 3, velocity: 0.75 },
          ],
          type: 'noteClip',
        },
      ],
      instruments: [
        { id: 'instruments_0', type: 'samplerInstrument' },
        { id: 'instruments_1', type: 'samplerInstrument' },
      ],
      samples: [],
      scenes: [
        {
          enter: [{ slotIds: ['slots_0'], type: 'playSlots' }],
          id: 'scenes_0',
          leave: [{ slotIds: ['slots_0'], type: 'stopSlots' }],
          name: 'A',
        },
        {
          enter: [{ slotIds: ['slots_1'], type: 'playSlots' }],
          id: 'scenes_1',
          leave: [{ slotIds: ['slots_1'], type: 'stopSlots' }],
          name: 'B',
        },
      ],
      slots: [
        {
          id: 'slots_0',
          loops: 0,
          name: 'Slot Name',
          timelineId: 'timelines_0',
          type: 'timelineSlot',
        },
        {
          id: 'slots_1',
          loops: 0,
          name: 'Slot Name',
          timelineId: 'timelines_1',
          type: 'timelineSlot',
        },
      ],
      timelines: [
        {
          clipRanges: [{ clipId: 'clips_0', end: 4, start: 0 }],
          duration: 4,
          id: 'timelines_0',
          name: 'Timeline Name',
        },
        {
          clipRanges: [{ clipId: 'clips_1', end: 4, start: 0 }],
          duration: 4,
          id: 'timelines_1',
          name: 'Timeline Name',
        },
      ],
    },
  });
});