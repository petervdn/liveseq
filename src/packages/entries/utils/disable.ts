import type { CommonProps } from '../../sequencer/lib/types';

export const disable = <T extends Pick<CommonProps, 'isEnabled'>>(common: T): T => {
  return {
    ...common,
    isEnabled: false,
  };
};
