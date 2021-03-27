import type { SerializableProject } from './project';
import type { Errors } from '../errors';
import { libraryVersion } from '../meta';
import { isSerializableProject } from './project';

const hasValidIds = (project: SerializableProject): boolean => {
  // TODO:
  return !!project;
};

export const validateProject = (project: SerializableProject, errors: Errors) => {
  // validate shape
  !isSerializableProject(project) && errors.invalidProjectShape();

  // validate version
  if (project.libraryVersion > libraryVersion) {
    errors.invalidProjectVersion(project.libraryVersion, libraryVersion);
  }

  // validate ids
  !hasValidIds(project) && errors.invalidIds();
};
