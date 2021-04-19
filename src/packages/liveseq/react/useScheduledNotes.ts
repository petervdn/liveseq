import { useEffect, useState } from 'react';
import { useLiveseqContext } from './useLiveseq';
import { usePlayback } from './usePlayback';

// TODO: get the internal data rather than replicating the behavior here
export const useScheduledNotes = () => {
  const liveseq = useLiveseqContext();
  const [scheduledNotes, setScheduledNotes] = useState<Array<string>>([]);
  const { playbackState } = usePlayback();

  useEffect(() => {
    playbackState === 'stopped' && setScheduledNotes([]);
  }, [playbackState]);

  useEffect(() => {
    return liveseq.onSchedule((data) => {
      const schedulingIds = data.scheduleItems.flatMap((item) =>
        item.notes.flatMap((note) => {
          return note.schedulingId;
        }),
      );

      setScheduledNotes(scheduledNotes.concat(schedulingIds));
    });
  }, [liveseq, scheduledNotes]);

  return scheduledNotes;
};
