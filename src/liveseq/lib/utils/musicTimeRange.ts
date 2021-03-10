import { addMusicTime, isBefore, MusicTime, subtractMusicTime } from './musicTime';

export type MusicTimeRange = {
  start: MusicTime;
  end: MusicTime;
};

// is rangeA intersecting rangeB
export const isInRange = (rangeA: MusicTimeRange, rangeB: MusicTimeRange) => {
  // todo: btw this implies that starts are before the end, which might not be the case
  return !(isBefore(rangeA.end, rangeB.start) || isBefore(rangeB.end, rangeA.start));
};

export const getItemsInRange = <T extends MusicTimeRange>(
  range: MusicTimeRange,
  items: Array<T>,
) => {
  return items.filter((item) => {
    return isInRange(item, range);
  });
};

export const addToRange = <T extends MusicTimeRange>(range: T, offsetBy: MusicTime): T => {
  return {
    ...range,
    start: addMusicTime(range.start, offsetBy),
    end: addMusicTime(range.end, offsetBy),
  };
};

export const subtractFromRange = <T extends MusicTimeRange>(range: T, offsetBy: MusicTime): T => {
  return {
    ...range,
    start: subtractMusicTime(range.start, offsetBy),
    end: subtractMusicTime(range.end, offsetBy),
  };
};
