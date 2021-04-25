import { libraryName } from './meta';
import { always } from '../../core/utils/always';

// so we can test the errors
export const errorMessages = {
  invalidLookahead: always('LookAheadTime should be larger than the scheduleInterval.'),
  invalidProjectVersion: (projectVersion: number, libraryVersion: number) => {
    return `Library version must be greater than the project version. ${libraryName} version is ${libraryVersion} and project version is ${projectVersion}.`;
  },
  invalidIds: always('Invalid ids in project.'),
  failedToCreateAudioContext: always('Failed to create AudioContext.'),
  contextSuspended: always('Cannot play, AudioContext is suspended.'),
  cantPlayWithoutProperAudioContext: always(
    'Cannot play, please supply a valid instance of AudioContext upon initialization. It is recommended to use createAudioContext() exported from this library.',
  ),
  invalidEntityId: (entityKey: string, id: string) => {
    return `Can't find id ${id} in ${entityKey}.`;
  },
};
