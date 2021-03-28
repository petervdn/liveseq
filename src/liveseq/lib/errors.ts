import { libraryName } from './meta';
import { always } from './utils/always';

export type Errors = typeof errorMessages;

// so we can test the errors
export const errorMessages = {
  invalidLookahead: always('LookAheadTime should be larger than the scheduleInterval.'),
  invalidProjectVersion: (projectVersion: number, libraryVersion: number) => {
    return `Library version must be greater than the project version. ${libraryName} version is ${libraryVersion} and project version is ${projectVersion}.`;
  },
  invalidIds: always('Invalid ids in project.'),
  contextSuspended: always('Cannot play, AudioContext is suspended.'),
};
