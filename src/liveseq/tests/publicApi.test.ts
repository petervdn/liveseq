import type { Bpm, Beats, TimeInSeconds } from '..';
import { createLiveseq, useLiveseq, useLiveseqContext, libraryVersion } from '..';

// TODO: this is not working to break the compilation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ExportsTypes = Bpm | Beats | TimeInSeconds;

it('exports all the public members from index', () => {
  expect(createLiveseq).toBeDefined();
  expect(useLiveseqContext).toBeDefined();
  expect(useLiveseq).toBeDefined();
  expect(libraryVersion).toBeDefined();
});
