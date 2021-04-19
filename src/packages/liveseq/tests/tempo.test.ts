import { createLiveseq } from '../lib/liveseq';
import type { Bpm } from '../index';
import { getMockedProps } from './getMockedProps';

it('can set tempo', () => {
  const testTempos = [60, 120, 123, 999, 0] as Array<Bpm>;

  testTempos.forEach((tempo) => {
    const project = createLiveseq(getMockedProps());
    project.setTempo(tempo);
    expect(project.getTempo()).toBe(tempo);
  });
});
