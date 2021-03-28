import { libraryName } from './meta';
import { always } from './utils/always';

export type Errors = typeof errorMessages;

// so we can test the errors and also avoid including them in prod
export const errorMessages = {
  invalidLookahead: always('LookAheadTime should be larger than the scheduleInterval.'),
  invalidProjectVersion: (projectVersion: number, libraryVersion: number) => {
    return `Library version must be greater than the project version.
            Project version is ${projectVersion} and ${libraryName} version is ${libraryVersion}.`;
  },
  invalidIds: always('Invalid ids in project.'),
  contextSuspended: always('Cannot play, AudioContext is suspended.'),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, unicorn/prevent-abbreviations
const getErrorThrower = <T extends Array<any>, U extends string>(fn: (...args: T) => U) => {
  return (...args: T): U => {
    throw new Error(fn(...args));
  };
};

export const getErrorThrowers = (messages: Errors): Errors => {
  // mutation!
  const throwers = {
    ...messages,
  };

  Object.keys(throwers).forEach((key) => {
    // TODO: fix
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    throwers[key] = getErrorThrower(throwers[key]);
  });

  return throwers;
};

export const errors = getErrorThrowers(errorMessages);
