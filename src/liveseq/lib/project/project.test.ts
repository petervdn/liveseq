import { createProject, defaultProjectName } from './project';

it('can create empty project with createProject', () => {
  expect(createProject()).toEqual({
    name: defaultProjectName,
    libraryVersion: 0,
    initialState: { slotPlaybackState: { activeSceneIds: [], playingSlots: [], queuedScenes: [] } },
    entities: {
      channels: [],
      clips: [],
      instruments: [],
      samples: [],
      scenes: [],
      slots: [],
      timelines: [],
    },
  });
});

it('can create a project with partial configuration', () => {
  // TODO: add more cases
  expect(createProject({ name: 'test' })).toEqual({
    ...createProject(),
    name: 'test',
  });
});
