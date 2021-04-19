import { useEffect, useState } from 'react';
import { useLiveseqContext } from './useLiveseq';
import { usePlayback } from './usePlayback';

// TODO: get the internal data rather than replicating the behavior here
export const usePlayedNotes = () => {
  const liveseq = useLiveseqContext();
  const [playedNotes, setPlayedNotes] = useState<Array<string>>([]);
  const { playbackState } = usePlayback();

  useEffect(() => {
    playbackState === 'stopped' && setPlayedNotes([]);
  }, [playbackState]);

  useEffect(() => {
    return liveseq.onPlayNote((scheduleNote) => {
      setPlayedNotes(playedNotes.concat([scheduleNote.schedulingId]));
    });
  }, [liveseq, playedNotes]);

  return playedNotes;
};
