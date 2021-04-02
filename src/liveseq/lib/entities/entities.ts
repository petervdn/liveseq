import type { SerializableProject } from '../project/project';
import type { NoteClipEntity, SerializableClip } from './noteClip/noteClip';
import { createNoteClipEntity } from './noteClip/noteClip';
import type { TimelineEntity } from './timeline/timeline';
import { createTimelineEntity, SerializableTimeline } from './timeline/timeline';
import { createSamplerEntity, SamplerEntity, SerializableSampler } from './sampler/sampler';
import { createSlotEntity, SerializableSlot, SlotEntity } from './slot/slot';
import type { SceneEntity } from './scene/scene';
import { createSceneEntity, SerializableScene } from './scene/scene';
import { createRecordById } from '../utils/createRecordById';
import type { SampleEntity, SerializableSample } from './sample/sample';
import { createSampleEntity } from './sample/sample';
import {
  createInstrumentChannelEntity,
  InstrumentChannelEntity,
  SerializableInstrumentChannel,
} from './instrumentChannel/instrumentChannel';

export type Entities = {
  instrumentChannels: Record<string, InstrumentChannelEntity>;
  noteClips: Record<string, NoteClipEntity>;
  samplers: Record<string, SamplerEntity>;
  samples: Record<string, SampleEntity>;
  scenes: Record<string, SceneEntity>;
  slots: Record<string, SlotEntity>;
  timelines: Record<string, TimelineEntity>;
};

export function createEntities(project: SerializableProject): Entities {
  // TODO: create one way links between entities when initializing

  return {
    instrumentChannels: createRecordById(
      project.entities.instrumentChannels.map(createInstrumentChannelEntity),
    ),
    noteClips: createRecordById(project.entities.noteClips.map(createNoteClipEntity)),
    samplers: createRecordById(project.entities.samplers.map(createSamplerEntity)),
    samples: createRecordById(project.entities.samples.map(createSampleEntity)),
    scenes: createRecordById(project.entities.scenes.map(createSceneEntity)),
    slots: createRecordById(project.entities.slots.map(createSlotEntity)),
    timelines: createRecordById(project.entities.timelines.map(createTimelineEntity)),
  };
}

// Serialization
export type SerializableEntities = {
  instrumentChannels: Array<SerializableInstrumentChannel>;
  noteClips: Array<SerializableClip>;
  samplers: Array<SerializableSampler>;
  samples: Array<SerializableSample>;
  scenes: Array<SerializableScene>;
  slots: Array<SerializableSlot>;
  timelines: Array<SerializableTimeline>;
};

export const serializeEntities = (entities: Entities): SerializableEntities => {
  return {
    instrumentChannels: Object.values(entities.instrumentChannels),
    noteClips: Object.values(entities.noteClips),
    samplers: Object.values(entities.samplers).map((instrument) => {
      const { schedule, ...withoutSchedule } = instrument;
      return withoutSchedule;
    }),
    samples: [],
    scenes: Object.values(entities.scenes),
    slots: Object.values(entities.slots),
    timelines: Object.values(entities.timelines),
  };
};
