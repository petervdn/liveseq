import { useEffect, useState } from 'react';
import { subscribe } from 'callbag-common';
import { useLiveseqContext } from './useLiveseq';
import { usePlayback } from './usePlayback';
import type { ScheduleData } from '../lib/scheduler/scheduler';

// TODO: get the internal data rather than replicating the behavior here
export const useScheduledNotes = () => {
  const liveseq = useLiveseqContext();
  const [scheduledNotes, setScheduledNotes] = useState<Array<string>>([]);
  const { playbackState } = usePlayback();

  useEffect(() => {
    playbackState === 'stop' && setScheduledNotes([]);
  }, [playbackState]);

  useEffect(() => {
    return subscribe<ScheduleData>((data) => {
      const schedulingIds = data.scheduleItems.flatMap((item) =>
        item.notes.flatMap((note) => {
          return note.schedulingId;
        }),
      );

      setScheduledNotes(scheduledNotes.concat(schedulingIds));
    })(liveseq.schedule$);
  }, [liveseq, scheduledNotes]);

  return scheduledNotes;
};
