import type { SerializableProject } from '../project/project';
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
import type { CommonProps } from '../liveseq';

export type Entities = {
  channels: Record<string, ChannelEntity>;
  timelines: Record<string, TimelineEntity>;
  clips: Record<string, NoteClipEntity>;
  instruments: Record<string, SamplerEntity>;
  slots: Record<string, SlotEntity>;
  scenes: Record<string, SceneEntity>;
};

const createRecordById = <T extends Pick<CommonProps, 'id'>>(
  entityConfig: Array<T>,
): Record<string, T> => {
  return entityConfig.reduce((accumulator, current) => {
    accumulator[current.id as keyof typeof accumulator] = current;
    return accumulator;
  }, {} as Record<string, T>);
};

// TODO: this is a work in progress
export function createEntities(project: SerializableProject, audioContext: AudioContext): Entities {
  return {
    channels: createRecordById(project.entities.channels.map(createInstrumentChannelEntity)),
    timelines: createRecordById(project.entities.timelines.map(createTimelineEntity)),
    clips: createRecordById(project.entities.clips.map(createNoteClipEntity)),
    slots: createRecordById(project.entities.slots.map(createSlotEntity)),
    scenes: createRecordById(project.entities.scenes.map(createSceneEntity)),
    instruments: createRecordById(
      project.entities.instruments.map((instrument) =>
        createSamplerEntity(audioContext, instrument),
      ),
    ),
  };
}

// entity selectors
export const getChannelsBySlotId = (
  entities: Pick<Entities, 'channels'>,
  slotId: string,
): Array<ChannelEntity> => {
  return Object.values(entities.channels).filter((channel) => {
    return channel.slotIds.includes(slotId);
  });
};

export const getClipsByTimelineId = (
  entities: Pick<Entities, 'timelines' | 'clips'>,
  timelineId: string,
) => {
  const timeline = entities.timelines[timelineId];
  return timeline.clips.map((clip) => ({
    ...clip,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ...entities.clips[clip.clipId],
  }));
};

// export const removeEntity = (entity: keyof Entities, id: string, entities: Entities) => {};
