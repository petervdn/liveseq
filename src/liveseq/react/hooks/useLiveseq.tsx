import { createContext, useContext, useMemo } from 'react';

import type { Liveseq, LiveseqProps } from '../../lib/liveseq';
import { createLiveseq } from '../../lib/liveseq';

// TODO: remove the "as Liveseq" cast
const liveseqContext = createContext<Liveseq>({} as Liveseq);

type LiveseqProvider = ({ children }: { children: React.ReactNode }) => JSX.Element;

// TODO: this is a WIP implementation.
// The idea is to use context and create hooks that subscribe to the context for certain events
// For example a play/stop button will subscribe to isPlaying event and it can be deeply nested in the React component tree
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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    liveseqContext,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    LiveseqProvider,
  };
};

export const useLiveseqContext = () => {
  return useContext(liveseqContext);
};
