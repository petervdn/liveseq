import { abSwitch } from '../../../projects/abSwitch';
import type { LiveseqProps } from '../liveseq';

// some tests should pass with all these props
export const propsForTests: Array<LiveseqProps | undefined> = [
  undefined,
  {},
  { project: abSwitch },
  { audioContext: {} as AudioContext },
];
