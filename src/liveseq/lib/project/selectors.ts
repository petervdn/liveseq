import { selectById } from '../utils/selectById';
import type { SerializableProject } from './project';

export const getChannelById = (project: SerializableProject) => (id: string) =>
  selectById(id, project.entities.channels);

export const getTimelineById = (project: SerializableProject) => (id: string) =>
  selectById(id, project.entities.timelines);

export const getSampleById = (project: SerializableProject) => (id: string) =>
  selectById(id, project.entities.samples);

export const getInstrumentById = (project: SerializableProject) => (id: string) =>
  selectById(id, project.entities.instruments);

export const getClipById = (project: SerializableProject) => (id: string) =>
  selectById(id, project.entities.clips);

export const getSlotById = (project: SerializableProject) => (id: string) =>
  selectById(id, project.entities.slots);

export const getSceneById = (project: SerializableProject) => (id: string) =>
  selectById(id, project.entities.scenes);
