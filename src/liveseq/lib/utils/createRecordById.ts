import type { CommonProps } from '../liveseq';

export const createRecordById = <T extends Pick<CommonProps, 'id'>>(
  entityConfig: Array<T>,
): Record<string, T> => {
  return entityConfig.reduce((accumulator, current) => {
    accumulator[current.id as keyof typeof accumulator] = current;
    return accumulator;
  }, {} as Record<string, T>);
};
