import { createPubSub } from '../../../pubSub/pubSub';
import { objectValues } from '../../../core/utils/objUtils';
import type { ScheduleData, ScheduleNote } from './scheduler';

export const createSchedulerEvents = () => {
  const events = {
    onSchedule: createPubSub<ScheduleData>(),
    onPlayNote: createPubSub<ScheduleNote>(),
  };

  const dispose = () => {
    objectValues(events).forEach((pubSub) => pubSub.dispose());
  };

  return {
    ...events,
    dispose,
  };
};
