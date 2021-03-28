import { createLiveseq } from '../lib/liveseq';
import type { Bpm } from '..';

it('can set tempo', () => {
  const testTempos = [60, 120, 123, 999, 0] as Array<Bpm>;

  testTempos.forEach((tempo) => {
    const project = createLiveseq();
    project.setTempo(tempo);
    expect(project.getTempo()).toBe(tempo);
  });
});
