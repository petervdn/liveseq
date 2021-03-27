import { createLiveseq } from '../lib/liveseq';
import { errorMessages } from '../lib/errors';
import { createProject, SerializableProject } from '../lib/project/project';
import { libraryVersion } from '../lib/meta';
import type { TimeInSeconds } from '../lib/time/time';

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

it('throws when project shape is invalid', () => {
  // error
  const validProject = createProject();
  const { libraryVersion, ...missingLibraryVersion } = validProject;
  const { entities, ...missingEntities } = validProject;
  const { initialState, ...missingInitialState } = validProject;
  // TODO: add cases for missing some entities, missing some initialState keys, and with other incorrect inner shapes
  const invalidProjects = [
    {} as SerializableProject,
    missingLibraryVersion as SerializableProject,
    missingEntities as SerializableProject,
    missingInitialState as SerializableProject,
  ];

  invalidProjects.forEach(() => {
    expect(() => createLiveseq({ project: {} as SerializableProject })).toThrowError(
      errorMessages.invalidProjectShape(),
    );
  });

  // ok
  expect(() => createLiveseq({ project: validProject })).not.toThrow();
});
