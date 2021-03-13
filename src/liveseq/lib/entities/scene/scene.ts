import type { LiveseqEntity } from '../liveseqEntity';
import type { GlobalAction } from '../../project/projectStructure';

export type Scene = LiveseqEntity & {
  eventActions: {
    enter?: Array<GlobalAction>; // when it becomes active
    leave?: Array<GlobalAction>; // when it becomes inactive
  };
};
