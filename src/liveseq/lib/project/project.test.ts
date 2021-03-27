import { createProject } from './project';

it('can create empty project with createProject', () => {
  expect(createProject()).toEqual({
    name: 'untitled',
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
  const partialProject = { name: 'test', libraryVersion: 1 };
  // TODO: add more cases
  expect(createProject(partialProject)).toEqual({
    name: partialProject.name,
    libraryVersion: partialProject.libraryVersion,
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
