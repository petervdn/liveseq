/* eslint-disable no-shadow */

import { libraryVersion } from '../librartVersion';

enum SlotType {
  Timeline = 'Timeline',
}

type Slot = {
  id: string;
  name?: string;
  isEnabled?: boolean;
  // TODO: add eventActions array
};

// so we can have other types of slots in the future, like a live sequencer or a clip without being in a timeline
type TimelineSlot = Slot & { type: SlotType.Timeline; timelineId: string };

// CHANNEL

type Channel = {
  id: string;
  name?: string;
  isEnabled?: boolean;
  instrumentId: string;
  slots: Array<TimelineSlot>; // only one slot per channel can play at a time
};

// INSTRUMENT

enum InstrumentType {
  Sampler = 'Sampler',
  SimpleSynth = 'SimpleSynth',
}

type Instrument = {
  id: string;
  type: InstrumentType;
  name?: string;
  isEnabled?: boolean;
  // TODO: should be a union type and maybe have initial settings
};

// NOTE CLIP

type Note = {
  start: string;
  end: string;
  velocity: number;
  pitch: string;
};

enum ClipType {
  NoteClip = 'NoteClip',
}

type NoteClip = {
  id: string;
  name?: string;
  duration: string;
  isEnabled?: boolean;
  type: ClipType.NoteClip;
  notes: Array<Note>;
};

// ready to add more later
type Clip = NoteClip;

// TIMELINE

type Timeline = {
  id: string;
  name?: string;
  duration?: string; // if no duration is specified, we derive from its clips
  isEnabled?: boolean;
  clips: Array<{
    clipId: string;
    start: string;
    end: string;
  }>;
};

// SCENE

// Scenes are actually a group of actions that can be triggered when scenes enter or leave
// nothing changes if there are no actions and the scene gets activated
// instead of being defined by "what is playing", it is defined by what changes should be made to the state
// this allows more control because maybe you only want to change things partially but keep some other things as they are

enum TransitionEvent {
  Enter = 'Enter',
  Leave = 'Leave',
}

enum GlobalActionType {
  Play = 'Play',
  Stop = 'Stop',
  Pause = 'Pause',
  PlaySlot = 'PlaySlot',
  StopSlot = 'StopSlot',
  StopAllSlots = 'StopAllSlots',
  ActivateScene = 'ActivateScene', // only one can be active at a time
}

// TODO: define union for all action types
type GlobalAction =
  | {
      type: GlobalActionType.PlaySlot;
      channelId: string;
      slotId: string;
    }
  | {
      type: GlobalActionType.StopAllSlots;
    };

type Scene = {
  id: string;
  name?: string;
  eventActions: Array<{
    event: TransitionEvent;
    action: GlobalAction;
  }>;
};

// PROJECT

// TODO: should slots be global
export type Project = {
  libraryVersion: number;
  name: string;
  channels: Array<Channel>;
  instruments: Array<Instrument>;
  timelines: Array<Timeline>;
  clips: Array<Clip>;
  scenes: Array<Scene>;
  activeSceneId: string | null; // TODO: if we keep scenes as a group of actions, we probably want to allow triggering multiple at once
};

export const defaultProject = {
  libraryVersion,
  name: 'untitled',
  channels: [],
  instruments: [],
  timelines: [],
  clips: [],
  scenes: [],
  activeSceneId: null,
};

// project file example (JSON)
export const project: Project = {
  libraryVersion: 0,
  name: 'Project Name',
  activeSceneId: 'scene_1',
  channels: [
    {
      id: 'channel_1',
      name: 'Channel Name',
      instrumentId: 'sampler_1',
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
      ],
    },
    {
      id: 'channel_2',
      instrumentId: 'synth_1',
      name: 'Channel Name',
      slots: [
        {
          id: 'slot_3',
          type: SlotType.Timeline,
          timelineId: 'timeline_1',
          name: 'Slot Name',
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
  scenes: [
    {
      id: 'scene_1',
      name: 'A',
      eventActions: [
        {
          event: TransitionEvent.Enter,
          action: {
            type: GlobalActionType.PlaySlot,
            channelId: 'channel_1',
            slotId: 'slot_1',
          },
        },
        {
          event: TransitionEvent.Enter,
          action: {
            type: GlobalActionType.PlaySlot,
            channelId: 'channel_2',
            slotId: 'slot_1',
          },
        },
      ],
    },
    {
      id: 'scene_2',
      name: 'B',
      eventActions: [
        {
          event: TransitionEvent.Enter,
          action: {
            type: GlobalActionType.StopAllSlots,
          },
        },
        {
          event: TransitionEvent.Enter,
          action: {
            type: GlobalActionType.PlaySlot,
            channelId: 'channel_1',
            slotId: 'slot_2',
          },
        },
      ],
    },
  ],
};

// Example switching
// Scene A:
//   - plays timeline_1 in channel_1 with sampler_1
//   - plays timeline_1 in channel_2 with synth_1

// Scene B:
//   - plays timeline_2 in channel_1 with sampler_1
//   - stops playing timeline_1 in channel_2 with synth_1
