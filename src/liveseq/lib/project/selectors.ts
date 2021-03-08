import { selectById } from '../utils/selectById';
import type { Project } from './projectStructure';

export const getChannelById = (id: string, project: Project) => {
  return selectById(id, project.entities.channels);
};

export const getTimelineById = (id: string, project: Project) => {
  return selectById(id, project.entities.timelines);
};

export const getSampleById = (id: string, project: Project) => {
  return selectById(id, project.entities.samples);
};

export const getInstrumentById = (id: string, project: Project) => {
  return selectById(id, project.entities.instruments);
};

export const getClipById = (id: string, project: Project) => {
  return selectById(id, project.entities.clips);
};

export const getSceneById = (id: string, project: Project) => {
  return selectById(id, project.entities.scenes);
};
