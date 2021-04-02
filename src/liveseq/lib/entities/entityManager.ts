import type { Entities } from './entities';
import type { SceneManager } from './scene/scene';
import type { SlotManager } from './slot/slot';
import type { TimelineManager } from './timeline/timeline';
import type { CommonProps, OmitId } from '../types';
import type { SampleManager } from './sample/sample';
import type { InstrumentChannelManager } from './instrumentChannel/serializableInstrumentChannel';
import type { NoteClipManager } from './noteClip/noteClip';
import type { SamplerManager } from './sampler/sampler';

export type AddEntity<Props> = (props: OmitId<Props & { id: string }>) => string;
export type RemoveEntity = (id: string) => void;

export type EntityManagerActions = InstrumentChannelManager &
  NoteClipManager &
  SceneManager &
  SlotManager &
  SamplerManager &
  TimelineManager &
  SampleManager;

// passed to each entity manager
export type EntityManagementProps = {
  addEntity: <T extends CommonProps>(getEntity: (id: string) => T) => string;
  getEntities: () => Entities;
  removeEntity: (id: string) => void;
  updateEntity: <T>(id: string, update: (entity: T) => T) => void;
  enable: (id: string) => void;
  disable: (id: string) => void;
};
