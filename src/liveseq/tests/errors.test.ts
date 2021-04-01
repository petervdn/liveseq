import { createLiveseq } from '../lib/liveseq';
import { errorMessages } from '../lib/errors';
import { createProject } from '../lib/project/project';
import type { TimeInSeconds } from '..';

it('throws when lookahead time is smaller than interval', () => {
  // error
  expect(() =>
    createLiveseq({ scheduleInterval: 1 as TimeInSeconds, lookAheadTime: 0.5 as TimeInSeconds }),
  ).toThrowError(errorMessages.invalidLookahead());

  // ok
  expect(() =>
    createLiveseq({ scheduleInterval: 1 as TimeInSeconds, lookAheadTime: 1.1 as TimeInSeconds }),
  ).not.toThrow();
});

it('throws when project version is incompatible', () => {
  // TODO: add this case below
  // // error
  // const invalidProject = createProject({ libraryVersion: 1 });
  //
  // expect(() => createLiveseq({ project: invalidProject })).toThrow();

  // ok
  expect(() => createLiveseq({ project: createProject({ libraryVersion: 0 }) })).not.toThrow();
});