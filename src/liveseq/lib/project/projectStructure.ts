/* eslint-disable no-shadow */
import { libraryVersion } from '../../libraryVersion';
import type { ActionType } from '../store/globalStore';

// this is present in many liveseq objs
export type LiveseqEntity = {
  id: string;
  name?: string;
  isEnabled?: boolean;
};

// SLOT
export enum SlotType {
  Timeline = 'Timeline',
}

export type TimelineSlot = LiveseqEntity & { type: SlotType.Timeline; timelineId: string };

// ready for adding more types of slots
export type Slot = TimelineSlot;

// CHANNEL
export enum ChannelType {
  Instrument = 'Instrument',
}

export type InstrumentChannel = LiveseqEntity & {
  type: ChannelType.Instrument;
  instrumentId: string;
  slotIds: Array<string>;
};

// ready for adding more types of channels
export type Channel = InstrumentChannel;

// INSTRUMENT
export enum InstrumentType {
  Sampler = 'Sampler',
  SimpleSynth = 'SimpleSynth',
}

export type SamplerInstrument = LiveseqEntity & {
  type: InstrumentType.Sampler;
};

export type SimpleSynthInstrument = LiveseqEntity & {
  type: InstrumentType.SimpleSynth;
};

export type Instrument = SamplerInstrument | SimpleSynthInstrument;

// CLIP
// Clips are good for placing data within a time duration
export enum ClipType {
  NoteClip = 'NoteClip',
}

export type Note = {
  start: string;
  end: string;
  velocity: number;
  pitch: string;
};

export type NoteClip = LiveseqEntity & {
  type: ClipType.NoteClip;
  duration: string;
  notes: Array<Note>;
};

// ready to add more later
export type Clip = NoteClip;

// TIMELINE
// Timelines are good for placing things in specific points in time
// for now just "clips" but could place other things

export type Timeline = LiveseqEntity & {
  duration?: string; // TODO: what to do if duration is undefined, maybe use Infinity instead or we can derive from its clips
  clips: Array<{
    clipId: string;
    start: string;
    end: string;
  }>;
};

// SCENE
// Scenes are actually a group of actions that can be triggered (Enter / Leave)
// nothing changes if there are no actions and the scene gets activated
// instead of being defined by "what is playing", it is defined by what changes should be made to the state
// this allows more control because maybe you only want to change things partially but keep some other things as they are

// TODO: define union for all action types
export type GlobalAction =
  | {
      type: ActionType.PlaySlots;
      // optional, if not present means all
      slotIds?: Array<string>;
    }
  | {
      type: ActionType.StopSlots;
      // optional, if not present means all
      slotIds?: Array<string>;
    };

export type Scene = LiveseqEntity & {
  eventActions: {
    enter?: Array<GlobalAction>; // when it becomes active
    leave?: Array<GlobalAction>; // when it becomes inactive
  };
};

// SAMPLES
export type Sample = LiveseqEntity & {
  source: string;
};

// PROJECT

// TODO: should slots be global
export type Project = {
  libraryVersion: number;
  name: string;
  startScenes: Array<string> | null; // The scenes to trigger when liveseq is played (from stopped state)
  entities: {
    channels: Array<Channel>;
    instruments: Array<Instrument>;
    timelines: Array<Timeline>;
    clips: Array<Clip>;
    scenes: Array<Scene>;
    slots: Array<Slot>;
    samples: Array<Sample>;
  };
};

export const defaultProject: Project = {
  libraryVersion,
  name: 'untitled',
  startScenes: null,
  entities: {
    channels: [],
    instruments: [],
    timelines: [],
    clips: [],
    scenes: [],
    samples: [],
    slots: [],
  },
};
