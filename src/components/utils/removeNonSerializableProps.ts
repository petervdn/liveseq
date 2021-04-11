// TODO: might have bad perf, did quick and dirty
export const removeNonSerializableProps = <T>(object: Record<string, unknown>): T => {
  return JSON.parse(JSON.stringify(object)) as T;
};
