import { abSwitch } from '../../../projects/abSwitch';
import type { PartialLiveseqProps } from '../liveseq';
import { getDefaultProps } from './getDefaultProps';

// some tests should pass with all these props
export const propsForTests: Array<PartialLiveseqProps | undefined> = [
  undefined,
  {},
  { project: abSwitch },
  { audioContext: {} as AudioContext },
  getDefaultProps(),
];
