import { createContext, useContext, useMemo } from 'react';

import type { LiveseqProps } from '../lib/liveseq';
import type { SubscribableLiveseq } from '../lib/subscribableLiveseq';
import { createSubscribableLiveseq } from '../lib/subscribableLiveseq';

const liveseqContext = createContext<SubscribableLiveseq>({} as SubscribableLiveseq);

type LiveseqProvider = ({ children }: { children: React.ReactNode }) => JSX.Element;

// The idea is to use context to get liveseq deep in the tree and subscribe to it
export const useLiveseq = (props: LiveseqProps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialProps = useMemo(() => props, []);

  const liveseq = useMemo<SubscribableLiveseq>(() => {
    return createSubscribableLiveseq(initialProps);
  }, [initialProps]);

  const LiveseqProvider = useMemo<LiveseqProvider>(() => {
    return ({ children }: { children: React.ReactNode }) => (
      <liveseqContext.Provider value={liveseq}>{children}</liveseqContext.Provider>
    );
  }, [liveseq]);

  return {
    liveseq,
    liveseqContext,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    LiveseqProvider,
  };
};

export const useLiveseqContext = () => {
  return useContext(liveseqContext);
};
