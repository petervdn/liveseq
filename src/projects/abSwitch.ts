import type { Project } from '../liveseq';
import { musicTimeToBeats } from '../liveseq/lib/time/musicTime';

// TODO: make this file describe this example
// Example switching
// Scene A:
//   - plays timeline_1 in channel_1 with sampler_1
//   - plays timeline_1 in channel_2 with synth_1

// Go from A to B automatically after timeline_1 has played 4 times

// Scene B:
//   - stops playing timeline_1 in channel_2 with synth_1
//   - plays timeline_2 in channel_1 with sampler_1

export const abSwitch: Project = {
  libraryVersion: 0,
  name: 'Project Name',
  startScenes: ['scene_1'],
  entities: {
    channels: [
      {
        id: 'channel_1',
        name: 'Channel Name',
        type: 'instrument',
        instrumentId: 'sampler_1',
        slotIds: ['slot_1', 'slot_2'],
      },
      {
        id: 'channel_2',
        name: 'Channel Name',
        type: 'instrument',
        instrumentId: 'synth_1',
        slotIds: ['slot_3'],
      },
    ],
    instruments: [
      {
        id: 'sampler_1',
        type: 'sampler',
      },
    ],
    // global to allow same slot in multiple channels
    slots: [
      {
        id: 'slot_1',
        type: 'timeline',
        name: 'Slot Name',
        timelineId: 'timeline_1',
      },
      {
        id: 'slot_2',
        type: 'timeline',
        timelineId: 'timeline_2',
        name: 'Slot Name',
      },
      {
        id: 'slot_3',
        type: 'timeline',
        timelineId: 'timeline_1',
        name: 'Slot Name',
      },
    ],
    // global to allow same clip being used multiple times in timelines
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
            pitch: 'C3',
          },
          {
            id: 'note_2',
            start: musicTimeToBeats([0, 1, 0]),
            end: musicTimeToBeats([0, 2, 0]),
            velocity: 0.75,
            pitch: 'C3',
          },
          {
            id: 'note_3',
            start: musicTimeToBeats([0, 4, 0]),
            end: musicTimeToBeats([0, 5, 0]),
            velocity: 0.75,
            pitch: 'C3',
          },
        ],
      },
    ],
    // global to allow same timeline being used in multiple channels or slots
    timelines: [
      {
        id: 'timeline_1',
        name: 'Timeline Name',
        duration: musicTimeToBeats([2, 0, 0]),
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
    scenes: [
      {
        id: 'scene_1',
        name: 'A',
        eventActions: {
          enter: [
            {
              type: 'playSlots',
              slotIds: ['slot_1', 'slot_3'],
            },
          ],
        },
      },
      {
        id: 'scene_2',
        name: 'B',
        eventActions: {
          enter: [
            {
              type: 'stopSlots',
            },
            {
              type: 'playSlots',
              slotIds: ['slot_2'],
            },
          ],
        },
      },
    ],
  },
};
