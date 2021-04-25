import type { SerializableProject } from './project';
import { libraryVersion } from '../meta';
import { errorMessages } from '../errors';

const hasValidIds = (project: SerializableProject): boolean => {
  // TODO:
  return !!project;
};

export const validateProject = (project: SerializableProject) => {
  // validate version
  if (libraryVersion < project.libraryVersion) {
    throw new Error(errorMessages.invalidProjectVersion(project.libraryVersion, libraryVersion));
  }

  // validate ids
  if (!hasValidIds(project)) {
    throw new Error(errorMessages.invalidIds());
  }
};
