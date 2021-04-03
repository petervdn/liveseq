import { createContext, useContext, useMemo } from 'react';
import type { Liveseq, LiveseqProps } from '..';
import { createLiveseq } from '..';

const liveseqContext = createContext<Liveseq>({} as Liveseq);

type LiveseqProvider = ({ children }: { children: React.ReactNode }) => JSX.Element;

// use context so we can get liveseq deep in the tree and subscribe to it
export const useLiveseq = (props: LiveseqProps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialProps = useMemo(() => props, []);

  const liveseq = useMemo<Liveseq>(() => {
    return createLiveseq(initialProps);
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
