import { getAbSwitch } from '../../projects/abSwitch';
import type { LiveseqProps } from '../liveseq';
import { getEngineProps } from './getEngineProps';

// some tests should pass with all these props
export const propsForTests: Array<LiveseqProps | undefined> = [
  undefined,
  {},
  { project: getAbSwitch() },
  { audioContext: {} as AudioContext },
  getEngineProps(),
];
