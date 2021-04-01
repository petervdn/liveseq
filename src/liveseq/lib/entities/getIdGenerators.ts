import { getIdGenerator } from '../utils/getIdGenerator';
import type { Entities } from './entities';

export const getHighestId = (record: Record<string, unknown>): number => {
  return Object.keys(record).reduce((accumulator, current) => {
    return Math.max(accumulator, parseInt(current.split('_')[1], 10));
  }, 0);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getIdGenerators = (entities: Entities) => {
  return {
    getChannelId: getIdGenerator('channel', getHighestId(entities.channels)),
    getClipId: getIdGenerator('clip', getHighestId(entities.clips)),
    getInstrumentId: getIdGenerator('instrument', getHighestId(entities.instruments)),
    getSampleId: getIdGenerator('sample', getHighestId(entities.samples)),
    getSceneId: getIdGenerator('scene', getHighestId(entities.scenes)),
    getSlotId: getIdGenerator('slot', getHighestId(entities.slots)),
    getTimelineId: getIdGenerator('timeline', getHighestId(entities.timelines)),
    getNoteId: getIdGenerator('note', 0),
  };
};
