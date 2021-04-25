import type { CommonProps, OmitId, PartialCommonProps } from '../liveseq/lib/types';
import { errorMessages } from '../liveseq/lib/errors';
import { getIdGenerator } from './idGenerator/getIdGenerator';
import { getHighestId } from './idGenerator/getHighestId';
import { enable } from './utils/enable';
import { disable } from './utils/disable';
import { objectValues } from '../core/utils/objUtils';
import { createPubSub } from '../pubSub/pubSub';

// TODO: make its own package (remove dependencies)
// TODO: rename Instance to Entity
export type EntriesInstance<
  Instance extends CommonProps & { dispose: () => void },
  Serializable extends PartialCommonProps<CommonProps>,
  // TODO: see if we can remove Extra by just passing everything in Instance
  Extra extends Record<string, unknown>
> = {
  add: (instance: OmitId<Instance & Extra>) => string;
  create: (serializable: OmitId<Serializable>) => string;
  encode: (id: string) => Serializable;
  getRecord: () => Record<string, Instance & Extra>;
  getList: () => Array<Instance & Extra>;
  get: (id: string) => Instance & Extra;
  remove: (id: string) => void;
  update: (id: string, update: (entity: Instance & Extra) => Instance & Extra) => void;
  enable: (id: string) => void;
  disable: (id: string) => void;
  dispose: () => void;
  subscribe: (callback: () => void) => () => void;
};

type Entries<T> = Record<string, Record<string, T>>;

// GENERIC ENTRIES BY KEY AND ID
export const createEntries = <
  Key extends string,
  Instance extends CommonProps & { dispose: () => void },
  Serializable extends PartialCommonProps<CommonProps>,
  Extra extends Record<string, unknown>
>(
  key: Key,
  decode: (serializable: Serializable) => Instance,
  encode: (instance: Instance) => Serializable,
  getExtra: (entries: EntriesInstance<Instance, Serializable, Extra>) => Extra,
) => {
  const currentEntries: Entries<Instance & Extra> = {
    [key]: {},
  };

  const get = (id: string) => {
    const entity = currentEntries[key][id];

    if (!entity) {
      throw new Error(errorMessages.invalidEntityId(key, id));
    }
    return entity;
  };

  const getRecord = () => {
    return currentEntries[key];
  };

  const getList = () => {
    return objectValues(getRecord());
  };

  const setEntries = (entities: Record<string, Instance & Extra>) => {
    currentEntries[key] = entities;
  };

  const generateId = getIdGenerator(key, getHighestId(Object.keys(getRecord())));

  const add = (instance: OmitId<Instance & Extra>) => {
    const id = generateId();

    const entries = getRecord();
    setEntries({
      ...entries,
      [id]: {
        ...instance,
        id,
      } as Instance & Extra,
    });
    return id;
  };

  const remove = (id: string) => {
    const entries = getRecord();
    const copy = { ...entries };
    // just to trigger an error in case the id doesn't exist
    get(id);
    // delete id
    delete copy[id];

    // TODO: search and remove any references by id

    setEntries(copy);
  };

  const update = (id: string, mapEntity: (entity: Instance & Extra) => Instance & Extra) => {
    const entity = get(id);

    setEntries({
      ...getRecord(),
      [id]: mapEntity(entity),
    });
  };

  const pubSub = createPubSub();

  const dispose = () => {
    pubSub.dispose();
    getList().forEach((entry) => {
      entry.dispose();
    });
    setEntries({});
  };

  const entriesInstance: EntriesInstance<Instance, Serializable, Extra> = {
    get,
    getRecord,
    getList,
    add,
    remove,
    update,
    enable: (id) => update(id, enable),
    disable: (id) => update(id, disable),
    // TODO: fix casts
    create: (serializable) => add(decode(serializable as Serializable) as Instance & Extra),
    encode: (id) => encode(get(id)),
    subscribe: pubSub.subscribe,
    dispose,
  };

  return {
    [key]: {
      ...entriesInstance,
      ...getExtra(entriesInstance),
    },
  } as Record<Key, typeof entriesInstance & ReturnType<typeof getExtra>>;
};
