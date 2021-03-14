import type { Project } from '../project/project';
import type { NoteClipEntity } from './clip/noteClip';
import { createNoteClipEntity } from './clip/noteClip';
import type { TimelineEntity } from './timeline/timeline';
import type { ChannelEntity } from './channel/channel';
import { createTimelineEntity } from './timeline/timeline';
import { createInstrumentChannelEntity } from './channel/channel';
import { createSamplerEntity, SamplerEntity } from './instrument/sampler';
import { createSlotEntity, SlotEntity } from './slot/slot';
import type { SceneEntity } from './scene/scene';
import { createSceneEntity } from './scene/scene';

export type LiveseqEntityConfig = {
  id: string;
  name?: string;
  isEnabled?: boolean;
};

export type Entities = {
  channels: Record<string, ChannelEntity>;
  timelines: Record<string, TimelineEntity>;
  clips: Record<string, NoteClipEntity>;
  instruments: Record<string, SamplerEntity>;
  slots: Record<string, SlotEntity>;
  scenes: Record<string, SceneEntity>;
};

const getRecordById = <T extends Pick<LiveseqEntityConfig, 'id'>>(
  entityConfig: Array<T>,
): Record<string, T> => {
  return entityConfig.reduce((accumulator, current) => {
    accumulator[current.id as keyof typeof accumulator] = current;
    return accumulator;
  }, {} as Record<string, T>);
};

// TODO: this is a work in progress
export const createEntities = (project: Project): Entities => {
  return {
    channels: getRecordById(project.entities.channels.map(createInstrumentChannelEntity)),
    timelines: getRecordById(project.entities.timelines.map(createTimelineEntity)),
    clips: getRecordById(project.entities.clips.map(createNoteClipEntity)),
    instruments: getRecordById(project.entities.instruments.map(createSamplerEntity)),
    slots: getRecordById(project.entities.slots.map(createSlotEntity)),
    scenes: getRecordById(project.entities.scenes.map(createSceneEntity)),
  };
};

// entity selectors
export const getChannelsBySlotId = (
  channelsById: Record<string, ChannelEntity>,
  slotId: string,
): Array<ChannelEntity> => {
  return Object.values(channelsById).filter((channel) => {
    return channel.slotIds.includes(slotId);
  });
};

// export const removeEntity = (entity: keyof Entities, id: string, entities: Entities) => {};
