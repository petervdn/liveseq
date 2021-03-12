import { selectById } from '../utils/selectById';
import type { Project } from '../entities/project/project';

export const getChannelById = (project: Project) => (id: string) =>
  selectById(id, project.entities.channels);

export const getTimelineById = (project: Project) => (id: string) =>
  selectById(id, project.entities.timelines);

export const getSampleById = (project: Project) => (id: string) =>
  selectById(id, project.entities.samples);

export const getInstrumentById = (project: Project) => (id: string) =>
  selectById(id, project.entities.instruments);

export const getClipById = (project: Project) => (id: string) =>
  selectById(id, project.entities.clips);

export const getSlotById = (project: Project) => (id: string) =>
  selectById(id, project.entities.slots);

export const getSceneById = (project: Project) => (id: string) =>
  selectById(id, project.entities.scenes);

export const getChannelsBySlotId = (project: Project, slotId: string) =>
  project.entities.channels.filter((channel) => channel.slotIds.includes(slotId));
