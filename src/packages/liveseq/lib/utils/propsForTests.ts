import { getAbSwitch } from '../../projects/abSwitch';
import type { LiveseqProps } from '../liveseq';
import { getEninePropsWithDefaults } from './getEninePropsWithDefaults';

// some tests should pass with all these props
export const propsForTests: Array<LiveseqProps | undefined> = [
  undefined,
  {},
  { project: getAbSwitch() },
  { audioContext: {} as AudioContext },
  getEninePropsWithDefaults(),
];
