import { isInRange, MusicTime } from '../../utils/musicTime';

type MusicTimeRange = {
  start: MusicTime;
  end: MusicTime;
};

export const getItemsInRange = <T extends MusicTimeRange>(
  start: MusicTime,
  end: MusicTime,
  items: Array<T>,
) => {
  return items.filter((item) => {
    return isInRange(item.start, item.end, start, end);
  });
};
