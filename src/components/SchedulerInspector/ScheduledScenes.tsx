import type { BeatsRange } from '../../liveseq';
import type { SlotPlaybackState } from '../../liveseq/lib/scheduler/schedulerState';
import { ItemsViewer } from '../general/ItemsViewer';
import { Item } from '../general/Item';

type ScheduleScenesProps = {
  slotPlaybackStateRanges: Array<BeatsRange & SlotPlaybackState>;
  horizontalScale?: number;
  verticalScale?: number;
  height?: number;
};

export const ScheduleScenes = ({
  slotPlaybackStateRanges,
  horizontalScale = 100,
  verticalScale = 18,
  height = 200,
}: ScheduleScenesProps) => {
  const noteHeight = height / 12;

  return (
    <ItemsViewer title="Active Scenes" height={height}>
      {slotPlaybackStateRanges.flatMap(({ start, end, ...slotPlaybackStanteRange }, index) => {
        return slotPlaybackStanteRange.activeSceneIds.map((activeSceneId, slotIndex) => {
          return (
            <Item
              // eslint-disable-next-line react/no-array-index-key
              key={`${index}${slotIndex}`}
              height={noteHeight}
              width={end - start}
              bottom={index * slotIndex}
              verticalScale={verticalScale}
              horizontalScale={horizontalScale}
              left={start}
            >
              {start} {activeSceneId}
            </Item>
          );
        });
      })}
    </ItemsViewer>
  );
};
