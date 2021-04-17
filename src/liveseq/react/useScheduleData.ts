import { useEffect, useState } from 'react';
import { useLiveseqContext } from './useLiveseq';
import { createRange } from '../lib/time/beatsRange/beatsRange';

export const useScheduleData = (start: number, end: number) => {
  const liveseq = useLiveseqContext();
  const [scheduleData] = useState(
    // TODO: would be nice to not have to pass the tempo
    liveseq.getScheduleDataWithinRange(createRange(start, end), liveseq.getTempo()),
  );
  const [scheduledNotes, setScheduledNotes] = useState<Array<string>>([]);

  useEffect(() => {
    return liveseq.onSchedule((data) => {
      const schedulingIds = data.scheduleItems.flatMap((item) =>
        item.notes.map((note) => note.schedulingId),
      );

      setScheduledNotes(scheduledNotes.concat(schedulingIds));
    });
  }, [liveseq, scheduledNotes]);

  return {
    scheduleData,
    scheduledNotes,
  };
};
