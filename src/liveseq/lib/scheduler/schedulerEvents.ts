import { createPubSub } from '../utils/pubSub';
import { objectValues } from '../utils/objUtils';
import type { ScheduleData } from './scheduler';

// TODO: this is a bit repeated in player
export const createSchedulerEvents = () => {
  const events = {
    onSchedule: createPubSub<ScheduleData>(),
  };

  const dispose = () => {
    objectValues(events).forEach((pubSub) => pubSub.dispose());
  };

  return {
    ...events,
    dispose,
  };
};
