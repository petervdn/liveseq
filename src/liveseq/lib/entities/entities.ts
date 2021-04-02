import type { SerializableProject } from '../project/project';
import type { NoteClipEntity, SerializableClip } from './noteClip/noteClip';
import { createNoteClipEntity } from './noteClip/noteClip';
import type { TimelineEntity } from './timeline/timeline';
import { createTimelineEntity, SerializableTimeline } from './timeline/timeline';
import { createSamplerEntity, SamplerEntity } from './instrument/sampler';
import { createSlotEntity, SerializableSlot, SlotEntity } from './slot/slot';
import type { SceneEntity } from './scene/scene';
import { createSceneEntity, SerializableScene } from './scene/scene';
import { createRecordById } from '../utils/createRecordById';
import type { SerializableInstrument } from './instrument/instrument';
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
  noteClips: Record<string, NoteClipEntity>;
  instruments: Record<string, SamplerEntity>;
  slots: Record<string, SlotEntity>;
  scenes: Record<string, SceneEntity>;
  samples: Record<string, unknown>;
};

export function createEntities(project: SerializableProject): Entities {
  // TODO: create one way links between entities when initializing

  return {
    instrumentChannels: createRecordById(
      project.entities.instrumentChannels.map(createInstrumentChannelEntity),
    ),
    noteClips: createRecordById(project.entities.noteClips.map(createNoteClipEntity)),
    instruments: createRecordById(project.entities.instruments.map(createSamplerEntity)),
    samples: createRecordById(project.entities.samples.map(createSampleEntity)),
    scenes: createRecordById(project.entities.scenes.map(createSceneEntity)),
    slots: createRecordById(project.entities.slots.map(createSlotEntity)),
    timelines: createRecordById(project.entities.timelines.map(createTimelineEntity)),
  };
}

// Serialization
export type SerializableEntities = {
  instrumentChannels: Array<SerializableInstrumentChannel>;
  instruments: Array<SerializableInstrument>;
  timelines: Array<SerializableTimeline>;
  noteClips: Array<SerializableClip>;
  scenes: Array<SerializableScene>;
  slots: Array<SerializableSlot>;
  samples: Array<SerializableSample>;
};

export const serializeEntities = (entities: Entities): SerializableEntities => {
  return {
    instrumentChannels: Object.values(entities.instrumentChannels),
    noteClips: Object.values(entities.noteClips),
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
  entities: Pick<Entities, 'timelines' | 'noteClips'>,
  timelineId: string,
) => {
  const timeline = entities.timelines[timelineId];
  return timeline.clipRanges.map((clip) => ({
    ...clip,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ...entities.noteClips[clip.noteClipId],
  }));
};
