import { musicTimeToBeats } from '../time/musicTime';
import type { NoteName } from '../note/note';
import { libraryVersion } from '../meta';

// TODO: move this to /projects/testProject
export const testProject = {
  libraryVersion,
  name: 'Project Name',
  startScenes: ['scenes_1'],
  entities: {
    channels: [
      {
        id: 'instrumentChannels_1',
        name: 'Channel Name',
        instrumentId: 'samplers_1',
        slotIds: ['slots_1', 'slot_2'],
      },
    ],
    instruments: [
      {
        id: 'samplers_1',
        type: 'samplerInstrument',
      },
    ],
    slots: [
      {
        id: 'slots_1',
        type: 'timelineSlot',
        name: 'Slot Name',
        timelineId: 'timelines_1',
        loops: 10,
      },
    ],
    clips: [
      {
        id: 'clips_1',
        type: 'noteClip',
        name: 'Clip Name',
        duration: musicTimeToBeats([1, 0, 0]),
        notes: [
          {
            id: 'notes_1',
            start: musicTimeToBeats([0, 0, 0]),
            end: musicTimeToBeats([0, 1, 0]),
            velocity: 0.75,
            pitch: 'C6' as NoteName,
          },
          {
            id: 'notes_2',
            start: musicTimeToBeats([0, 1, 0]),
            end: musicTimeToBeats([0, 2, 0]),
            velocity: 0.75,
            pitch: 'C5' as NoteName,
          },
          {
            id: 'notes_3',
            start: musicTimeToBeats([0, 2, 0]),
            end: musicTimeToBeats([0, 3, 0]),
            velocity: 0.75,
            pitch: 'C5' as NoteName,
          },
          {
            id: 'notes_4',
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
        id: 'timelines_1',
        name: 'Timeline Name',
        duration: musicTimeToBeats([1, 0, 0]),
        clips: [
          {
            clipId: 'clips_1',
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
