import type { CommonProps } from '../../sequencer/lib/types';

export const enable = <T extends Pick<CommonProps, 'isEnabled'>>(common: T): T => {
  return {
    ...common,
    isEnabled: true,
  };
};
