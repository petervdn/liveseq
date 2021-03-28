import { getIdGenerator } from '../utils/getIdGenerator';
import type { Entities } from './entities';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getIdGenerators = (entities: Entities) => {
  return {
    // TODO: fix initial index using project info
    getChannelId: getIdGenerator('channel', 0),
    // TODO: fix initial index using project info
    getClipId: getIdGenerator('clip', 0),
    // TODO: fix initial index using project info
    getInstrumentId: getIdGenerator('instrument', 0),
    // TODO: fix initial index using project info
    getSampleId: getIdGenerator('sample', 0),
    // TODO: fix initial index using project info
    getSceneId: getIdGenerator('scene', 0),
    // TODO: fix initial index using project info
    getSlotId: getIdGenerator('slot', 0),
    // TODO: fix initial index using project info
    getTimelineId: getIdGenerator('timeline', 0),
    // TODO: fix initial index using project info
    getNoteId: getIdGenerator('note', 0),
  };
};
