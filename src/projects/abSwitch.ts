import { Project, SlotType, InstrumentType, ClipType, ChannelType, ActionType } from '../liveseq';

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
        type: ChannelType.Instrument,
        instrumentId: 'sampler_1',
        slots: [
          {
            slotId: 'slot_1',
          },
          {
            slotId: 'slot_2',
          },
        ],
      },
      {
        id: 'channel_2',
        name: 'Channel Name',
        type: ChannelType.Instrument,
        instrumentId: 'synth_1',
        slots: [
          {
            slotId: 'slot_3',
          },
        ],
      },
    ],
    instruments: [
      {
        id: 'sampler_1',
        type: InstrumentType.Sampler,
      },
    ],
    // global to allow same slot in multiple channels
    slots: [
      {
        id: 'slot_1',
        type: SlotType.Timeline,
        name: 'Slot Name',
        timelineId: 'timeline_1',
      },
      {
        id: 'slot_2',
        type: SlotType.Timeline,
        timelineId: 'timeline_2',
        name: 'Slot Name',
      },
      {
        id: 'slot_3',
        type: SlotType.Timeline,
        timelineId: 'timeline_1',
        name: 'Slot Name',
      },
    ],
    // global to allow same clip being used multiple times in timelines
    clips: [
      {
        id: 'clip_1',
        type: ClipType.NoteClip,
        name: 'Clip Name',
        duration: '1.0.0',
        notes: [
          {
            start: '0.0.0',
            end: '0.1.0',
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
        duration: '1.0.0',
        clips: [
          {
            clipId: 'clip_1',
            start: '1.0.0',
            end: '2.0.0',
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
              type: ActionType.PlaySlots,
              slots: [
                {
                  channelId: 'channel_1',
                  slotId: 'slot_1',
                },
                {
                  channelId: 'channel_2',
                  slotId: 'slot_1',
                },
              ],
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
              type: ActionType.StopSlots,
            },
            {
              type: ActionType.PlaySlots,
              slots: [
                {
                  channelId: 'channel_1',
                  slotId: 'slot_2',
                },
              ],
            },
          ],
        },
      },
    ],
  },
};
