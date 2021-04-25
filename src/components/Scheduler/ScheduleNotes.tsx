import { useEffect } from 'react';
import { getFrequency } from '../../packages/note/note';
import type { ScheduleItem } from '../../packages/sequencer/lib/scheduler/scheduler';
import { ItemsViewer, ViewerVisualProps } from '../general/ItemsViewer';
import { Item } from '../general/Item';
import { Box } from '../general/Box';
import { Label } from '../general/Label';
import { useScheduledNotes } from '../../packages/sequencer/react/useScheduledNotes';
import { usePlayedNotes } from '../../packages/sequencer/react/usePlayedNotes';

type ScheduleNotesProps = {
  scheduleItem: ScheduleItem;
  verticalScale?: number;
  octaves?: number;
} & ViewerVisualProps;

export const ScheduleNotes = ({
  scheduleItem,
  horizontalScale,
  end,
  verticalScale = 0.1,
  octaves = 2,
  height = 200,
}: ScheduleNotesProps) => {
  const scheduledNotes = useScheduledNotes();
  const playedNotes = usePlayedNotes();
  const noteHeight = height / (12 * octaves);

  // TODO: remove
  useEffect(() => {
    // eslint-disable-next-line no-console
    // console.log({
    //   scheduledNotes: scheduledNotes.length,
    //   playedNotes: playedNotes.length,
    // });
  }, [scheduledNotes.length, playedNotes.length]);

  // TODO: note output per instrument (instrument channel??)
  return (
    <ItemsViewer
      horizontalScale={horizontalScale}
      end={end}
      title="Scheduled Notes"
      height={height}
    >
      {scheduleItem.notes.map((note) => {
        // eslint-disable-next-line no-nested-ternary
        const itemVariant = playedNotes.includes(note.schedulingId)
          ? 'active'
          : scheduledNotes.includes(note.schedulingId)
          ? 'highlighted'
          : 'regular';

        return (
          <Item
            key={note.schedulingId}
            height={noteHeight}
            width={note.end - note.start}
            bottom={getFrequency(note.pitch)}
            left={note.start}
            horizontalScale={horizontalScale}
            verticalScale={verticalScale}
            variant={itemVariant}
          >
            <Box
              width={`${note.velocity * 100}%`}
              marginTop={1}
              height={1}
              style={{ background: 'red' }}
            />
            <Label>{`${note.id} ${note.pitch}`}</Label>
          </Item>
        );
      })}
    </ItemsViewer>
  );
};
