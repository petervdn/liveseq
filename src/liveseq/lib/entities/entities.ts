import type { SerializableProject } from '../project/project';
import type { NoteClipEntity } from './clip/noteClip';
import { createNoteClipEntity } from './clip/noteClip';
import type { TimelineEntity } from './timeline/timeline';
import { createTimelineEntity, SerializableTimeline } from './timeline/timeline';
import { createSamplerEntity, SamplerEntity } from './instrument/sampler';
import { createSlotEntity, SerializableSlot, SlotEntity } from './slot/slot';
import type { SceneEntity } from './scene/scene';
import { createSceneEntity, SerializableScene } from './scene/scene';
import { createRecordById } from '../utils/createRecordById';
import type { SerializableInstrument } from './instrument/instrument';
import type { SerializableClip } from './clip/clip';
import type { SerializableSample } from './sample/sample';
import {
  createInstrumentChannelEntity,
  InstrumentChannelEntity,
  SerializableInstrumentChannel,
} from './instrumentChannel/instrumentChannel';
import { createSampleEntity } from './sample/sample';

export type Entities = {
  instrumentChannels: Record<string, InstrumentChannelEntity>;
  timelines: Record<string, TimelineEntity>;
  clips: Record<string, NoteClipEntity>;
  instruments: Record<string, SamplerEntity>;
  slots: Record<string, SlotEntity>;
  scenes: Record<string, SceneEntity>;
  samples: Record<string, unknown>;
};

export function createEntities(project: SerializableProject): Entities {
  // TODO: create one way links between entities when initializing

  return {
    instrumentChannels: createRecordById(
      project.entities.channels.map(createInstrumentChannelEntity),
    ),
    clips: createRecordById(project.entities.clips.map(createNoteClipEntity)),
    instruments: createRecordById(project.entities.instruments.map(createSamplerEntity)),
    samples: createRecordById(project.entities.samples.map(createSampleEntity)),
    scenes: createRecordById(project.entities.scenes.map(createSceneEntity)),
    slots: createRecordById(project.entities.slots.map(createSlotEntity)),
    timelines: createRecordById(project.entities.timelines.map(createTimelineEntity)),
  };
}

// Serialization
export type SerializableEntities = {
  channels: Array<SerializableInstrumentChannel>;
  instruments: Array<SerializableInstrument>;
  timelines: Array<SerializableTimeline>;
  clips: Array<SerializableClip>;
  scenes: Array<SerializableScene>;
  slots: Array<SerializableSlot>;
  samples: Array<SerializableSample>;
};

export const serializeEntities = (entities: Entities): SerializableEntities => {
  return {
    channels: Object.values(entities.instrumentChannels),
    clips: Object.values(entities.clips),
    instruments: Object.values(entities.instruments).map((instrument) => {
      const { schedule, ...withoutSchedule } = instrument;
      return withoutSchedule;
    }),
    samples: [],
    scenes: Object.values(entities.scenes),
    slots: Object.values(entities.slots),
    timelines: Object.values(entities.timelines),
  };
};

// entity selectors
export const getInstrumentChannelsBySlotId = (
  entities: Pick<Entities, 'instrumentChannels'>,
  slotId: string,
): Array<InstrumentChannelEntity> => {
  return Object.values(entities.instrumentChannels).filter((channel) => {
    return channel.slotIds.includes(slotId);
  });
};

export const getClipsByTimelineId = (
  entities: Pick<Entities, 'timelines' | 'clips'>,
  timelineId: string,
) => {
  const timeline = entities.timelines[timelineId];
  return timeline.clipRanges.map((clip) => ({
    ...clip,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ...entities.clips[clip.clipId],
  }));
};
