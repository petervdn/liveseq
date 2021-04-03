import { useEffect, useState } from 'react';
import { useLiveseqContext } from './useLiveseq';
import type { Bpm } from '..';

export const useTempo = () => {
  const liveseq = useLiveseqContext();
  const [tempo, setTempoInternal] = useState(liveseq.getTempo);

  useEffect(() => {
    return liveseq.onTempoChange((tempo) => setTempoInternal(tempo));
  }, [liveseq]);

  const setTempo = (tempo: number) => {
    liveseq.setTempo(tempo as Bpm);
  };

  return [tempo, setTempo] as const;
};
