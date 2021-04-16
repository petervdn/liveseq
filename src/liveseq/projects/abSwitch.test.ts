import { getAbSwitch } from './abSwitch';

it('abSwitch is correct', () => {
  const abSwitch = getAbSwitch();
  expect(abSwitch).toEqual({
    entities: {
      instrumentChannels: [
        {
          id: 'instrumentChannels_0',
          instrumentId: 'samplers_0',
          isEnabled: true,
          name: 'Channel Name',
          slotIds: ['slots_0'],
        },
        {
          id: 'instrumentChannels_1',
          instrumentId: 'samplers_1',
          isEnabled: true,
          name: 'Channel Name',
          slotIds: ['slots_1'],
        },
      ],
      noteClips: [
        {
          duration: 4,
          id: 'noteClips_0',
          isEnabled: true,
          name: 'Clip Name',
          notes: [
            { end: 1, id: 'notes_0', pitch: 'G5', start: 0, velocity: 0.75 },
            { end: 2, id: 'notes_1', pitch: 'G6', start: 1, velocity: 0.6 },
            { end: 3, id: 'notes_2', pitch: 'G6', start: 2, velocity: 0.6 },
            { end: 4, id: 'notes_3', pitch: 'G6', start: 3, velocity: 0.6 },
          ],
        },
        {
          duration: 4,
          id: 'noteClips_1',
          isEnabled: true,
          name: 'Clip Name',
          notes: [
            { end: 1, id: 'notes_4', pitch: 'C5', start: 0, velocity: 0.75 },
            { end: 2, id: 'notes_5', pitch: 'C4', start: 1, velocity: 0.6 },
            { end: 3, id: 'notes_6', pitch: 'C4', start: 2, velocity: 0.6 },
            { end: 4, id: 'notes_7', pitch: 'C4', start: 3, velocity: 0.6 },
          ],
        },
      ],
      samplers: [
        { id: 'samplers_0', isEnabled: true },
        { id: 'samplers_1', isEnabled: true },
      ],
      samples: [],
      scenes: [
        {
          enter: [{ slotIds: ['slots_0'], type: 'playSlots' }],
          id: 'scenes_0',
          isEnabled: true,
          name: 'Enter A',
        },
        {
          enter: [{ slotIds: ['slots_0'], type: 'stopSlots' }],
          id: 'scenes_1',
          isEnabled: true,
          name: 'Leave A',
        },
        {
          enter: [{ slotIds: ['slots_1'], type: 'playSlots' }],
          id: 'scenes_2',
          isEnabled: true,
          name: 'Enter B',
        },
        {
          enter: [{ slotIds: ['slots_1'], type: 'stopSlots' }],
          id: 'scenes_3',
          isEnabled: true,
          name: 'Leave B',
        },
      ],
      slots: [
        {
          id: 'slots_0',
          isEnabled: true,
          loops: 0,
          name: 'Slot Name',
          timelineId: 'timelines_0',
          type: 'timelineSlot',
        },
        {
          id: 'slots_1',
          isEnabled: true,
          loops: 0,
          name: 'Slot Name',
          timelineId: 'timelines_1',
          type: 'timelineSlot',
        },
      ],
      timelines: [
        {
          clipRanges: [{ end: 4, noteClipId: 'noteClips_0', start: 0 }],
          duration: 4,
          id: 'timelines_0',
          isEnabled: true,
          name: 'Timeline Name',
        },
        {
          clipRanges: [{ end: 4, noteClipId: 'noteClips_1', start: 0 }],
          duration: 4,
          id: 'timelines_1',
          isEnabled: true,
          name: 'Timeline Name',
        },
      ],
    },
    initialState: {
      slotPlaybackState: {
        activeSceneIds: [],
        playingSlots: [],
        queuedScenes: [
          { sceneId: 'scenes_0', start: 0 },
          { sceneId: 'scenes_1', start: 0 },
          { sceneId: 'scenes_2', start: 4 },
          { sceneId: 'scenes_3', start: 4 },
        ],
      },
    },
    libraryVersion: 0,
    name: 'abSwitch',
  });
});
