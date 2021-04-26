/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable  */
type TypedObjectValues = <Object extends { [key: string]: any }, Key extends keyof Object>(
  obj: Object,
) => Array<Object[Key]>;
export const objectValues: TypedObjectValues = Object.values;

type TypedObjectKeys = <Object extends { [key: string]: any }, Key extends keyof Object>(
  obj: Object,
) => Array<Key>;
export const objectKeys: TypedObjectKeys = Object.keys;

type TypedObjectEntries = <Object extends { [key: string]: any }, Key extends keyof Object>(
  obj: Object,
) => Array<[Key, Object[Key]]>;
export const objectEntries: TypedObjectEntries = Object.entries;
