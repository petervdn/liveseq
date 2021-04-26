import { createLiveseq } from '../lib/liveseq';
import { getMockedProps } from './getMockedProps';
import type { Bpm } from '../../core';

it('can set tempo', () => {
  const testTempos = [60, 120, 123, 999, 0] as Array<Bpm>;

  testTempos.forEach((tempo) => {
    const project = createLiveseq(getMockedProps());
    project.setTempo(tempo);
    expect(project.getTempo()).toBe(tempo);
  });
});
