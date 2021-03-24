import type { SerializableProject } from '../liveseq';
import { musicTimeToBeats } from '../liveseq/lib/time/musicTime';
import type { NoteName } from '../liveseq/lib/note/note';
import { createSlotPlaybackState } from '../liveseq/lib/player/slotPlaybackState';
import type { Beats } from '../liveseq/lib/time/time';

// TODO: make this file describe this example
// Example switching
// Scene A:
//   - plays timeline_1 in channel_1 with sampler_1
//   - plays timeline_1 in channel_2 with synth_1

// Go from A to B automatically after timeline_1 has played 4 times

// Scene B:
//   - stops playing timeline_1 in channel_2 with synth_1
//   - plays timeline_2 in channel_1 with sampler_1

export const abSwitch: SerializableProject = {
  libraryVersion: 0,
  name: 'A-B Switch',
  slotPlaybackState: {
    ...createSlotPlaybackState(),
    queuedScenes: [
      {
        start: 0 as Beats,
        end: 4 as Beats,
        sceneId: 'scene_1',
      },
      {
        start: 4 as Beats,
        end: 8 as Beats,
        sceneId: 'scene_2',
      },
    ],
  },
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
    // global to allow same slot in multiple channels
    slots: [
      {
        id: 'slot_1',
        type: 'timelineSlot',
        name: 'Slot Name',
        timelineId: 'timeline_1',
        loops: 0,
      },
      {
        id: 'slot_2',
        type: 'timelineSlot',
        timelineId: 'timeline_2',
        name: 'Slot Name',
        loops: 0,
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
      {
        id: 'clip_2',
        type: 'noteClip',
        name: 'Clip Name',
        duration: musicTimeToBeats([1, 0, 0]),
        notes: [
          {
            id: 'note_1',
            start: musicTimeToBeats([0, 0, 0]),
            end: musicTimeToBeats([0, 1, 0]),
            velocity: 0.75,
            pitch: 'G5' as NoteName,
          },
          {
            id: 'note_2',
            start: musicTimeToBeats([0, 1, 0]),
            end: musicTimeToBeats([0, 2, 0]),
            velocity: 0.75,
            pitch: 'G6' as NoteName,
          },
          {
            id: 'note_3',
            start: musicTimeToBeats([0, 2, 0]),
            end: musicTimeToBeats([0, 3, 0]),
            velocity: 0.75,
            pitch: 'G6' as NoteName,
          },
          {
            id: 'note_4',
            start: musicTimeToBeats([0, 3, 0]),
            end: musicTimeToBeats([0, 4, 0]),
            velocity: 0.75,
            pitch: 'G6' as NoteName,
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
      {
        id: 'timeline_2',
        name: 'Timeline Name',
        duration: musicTimeToBeats([1, 0, 0]),
        clips: [
          {
            clipId: 'clip_2',
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
              slotIds: ['slot_1'],
            },
          ],
          leave: [
            {
              type: 'stopSlots',
              slotIds: ['slot_1'],
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
