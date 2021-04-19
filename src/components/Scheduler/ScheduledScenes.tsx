import type { BeatsRange } from '../../packages/liveseq';
import type { SlotPlaybackState } from '../../packages/liveseq/lib/scheduler/schedulerState';
import { ItemsViewer } from '../general/ItemsViewer';
import { Item } from '../general/Item';
import { Label } from '../general/Label';

type ScheduleScenesProps = {
  slotPlaybackStateRanges: Array<BeatsRange & SlotPlaybackState>;
  end: number;
  horizontalScale: number;
  verticalScale?: number;
  height: number;
};

export const ScheduleScenes = ({
  slotPlaybackStateRanges,
  end,
  horizontalScale,
  verticalScale = 18,
  height,
}: ScheduleScenesProps) => {
  const noteHeight = height / 12;

  return (
    <ItemsViewer horizontalScale={horizontalScale} end={end} title="Active Scenes" height={height}>
      {slotPlaybackStateRanges.flatMap(({ start, end, ...slotPlaybackStateRange }, index) => {
        return slotPlaybackStateRange.queuedScenes.map((queuedScene, slotIndex) => {
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
              <Label>{queuedScene.sceneId}</Label>
            </Item>
          );
        });
      })}
    </ItemsViewer>
  );
};
