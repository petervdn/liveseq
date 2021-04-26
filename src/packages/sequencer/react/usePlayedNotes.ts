import { useEffect, useState } from 'react';
import { subscribe } from 'callbag-common';
import { useLiveseqContext } from './useLiveseq';
import { usePlayback } from './usePlayback';
import type { ScheduleNote } from '../lib/scheduler/scheduler';

// TODO: get the internal data rather than replicating the behavior here
export const usePlayedNotes = () => {
  const liveseq = useLiveseqContext();
  const [playedNotes, setPlayedNotes] = useState<Array<string>>([]);
  const { playbackState } = usePlayback();

  useEffect(() => {
    playbackState === 'stop' && setPlayedNotes([]);
  }, [playbackState]);

  useEffect(() => {
    return subscribe<ScheduleNote>((scheduleNote) => {
      setPlayedNotes(playedNotes.concat([scheduleNote.schedulingId]));
    })(liveseq.notePlay$);
  }, [liveseq, playedNotes]);

  return playedNotes;
};
