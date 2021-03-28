import { createContext, useContext, useMemo } from 'react';
import type { SubscribableEngine } from '../lib/subscribableEngine';
import { createSubscribableEngine } from '../lib/subscribableEngine';
import type { LiveseqProps } from '..';

const liveseqContext = createContext<SubscribableEngine>({} as SubscribableEngine);

type LiveseqProvider = ({ children }: { children: React.ReactNode }) => JSX.Element;

// The idea is to use context to get liveseq deep in the tree and subscribe to it
export const useLiveseq = (props: LiveseqProps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialProps = useMemo(() => props, []);

  const liveseq = useMemo<SubscribableEngine>(() => {
    return createSubscribableEngine(initialProps);
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
