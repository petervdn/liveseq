import type { CommonProps, OmitId } from '../types';
import { errorMessages } from '../errors';
import { getIdGenerator } from '../utils/getIdGenerator';
import { getHighestId } from '../utils/getHighestId';
import { enable } from '../utils/enable';
import { disable } from '../utils/disable';

// TODO: rename Instance to Entity
type EntriesInstance<Instance extends CommonProps, Serializable extends CommonProps> = {
  add: (instance: OmitId<Instance>) => string;
  create: (serializable: OmitId<Serializable>) => string;
  encode: (id: string) => Serializable;
  getRecord: () => Record<string, Instance>;
  get: (id: string) => Instance;
  remove: (id: string) => void;
  update: (id: string, update: (entity: Instance) => Instance) => void;
  enable: (id: string) => void;
  disable: (id: string) => void;
  dispose: () => void;
};

type Entries<T> = Record<string, Record<string, T>>;

// GENERIC ENTRIES BY KEY AND ID
export const createEntries = <
  Key extends string,
  Instance extends CommonProps,
  Serializable extends CommonProps,
  Extra extends Record<string, unknown>
>(
  key: Key,
  decode: (serializable: Serializable) => Instance,
  encode: (instance: Instance) => Serializable,
  getExtra: (entries: EntriesInstance<Instance, Serializable>) => Extra,
) => {
  const currentEntries: Entries<Instance> = {
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

  const setEntries = (entities: Record<string, Instance>) => {
    currentEntries[key] = entities;
  };

  const generateId = getIdGenerator(key, getHighestId(Object.keys(getRecord())));

  const add = (instance: OmitId<Instance>) => {
    const id = generateId();

    const entries = getRecord();
    setEntries({
      ...entries,
      [id]: {
        ...instance,
        id,
      } as Instance,
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

  const update = (id: string, mapEntity: (entity: Instance) => Instance) => {
    const entity = get(id);

    setEntries({
      [id]: mapEntity(entity),
    });
  };

  const dispose = () => {
    setEntries({});
  };

  const entriesInstance: EntriesInstance<Instance, Serializable> = {
    get,
    getRecord,
    add,
    remove,
    update,
    enable: (id) => update(id, enable),
    disable: (id) => update(id, disable),
    // TODO: fix casts
    create: (serializable) => add(decode(serializable as Serializable) as Instance),
    encode: (id) => encode(get(id)),
    dispose,
  };

  return {
    [key]: {
      ...entriesInstance,
      ...getExtra(entriesInstance),
    },
  } as Record<Key, typeof entriesInstance & ReturnType<typeof getExtra>>;
};
