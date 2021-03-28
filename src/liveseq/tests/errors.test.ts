import { createLiveseq } from '../lib/liveseq';
import { errorMessages } from '../lib/errors';
import { createProject } from '../lib/project/project';
import { libraryVersion } from '../lib/meta';
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
  // error
  const invalidProject = createProject({ libraryVersion: libraryVersion + 1 });

  expect(() => createLiveseq({ project: invalidProject })).toThrowError(
    errorMessages.invalidProjectVersion(invalidProject.libraryVersion, libraryVersion),
  );

  // ok
  expect(() => createLiveseq({ project: createProject({ libraryVersion }) })).not.toThrow();
});
