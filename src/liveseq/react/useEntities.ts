import { useEffect, useState } from 'react';
import { useLiveseqContext } from './useLiveseq';

// TODO: DRY
export const useInstrumentChannels = () => {
  const liveseq = useLiveseqContext();
  const [instrumentChannels, setInstrumentChannels] = useState(liveseq.instrumentChannels.getList);

  useEffect(() => {
    return liveseq.instrumentChannels.subscribe(() =>
      setInstrumentChannels(liveseq.instrumentChannels.getList()),
    );
  }, [liveseq]);

  return instrumentChannels;
};

export const useScenes = () => {
  const liveseq = useLiveseqContext();
  const [scenes, setScenes] = useState(liveseq.scenes.getList);

  useEffect(() => {
    return liveseq.scenes.subscribe(() => setScenes(liveseq.scenes.getList()));
  }, [liveseq]);
  return scenes;
};
