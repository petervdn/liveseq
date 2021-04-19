import { createPubSub } from '../../../pubSub/pubSub';
import { objectValues } from '../../../core/utils/objUtils';
import type { ScheduleData, ScheduleNote } from './scheduler';

// TODO: this is a bit repeated in player
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
