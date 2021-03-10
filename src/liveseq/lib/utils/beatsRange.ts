import { Beats, Bpm, TimeInSeconds, timeToBeats } from './musicTime';

// TODO: consolidate this stuff with musicTime stuff in their own "timing" directory
export type BeatsRange = {
  start: Beats;
  end: Beats;
};

export type TimeRange = {
  start: TimeInSeconds;
  end: TimeInSeconds;
};

export const timeRangeToBeatsRange = (timeRange: TimeRange, bpm: Bpm): BeatsRange => {
  return {
    start: timeToBeats(timeRange.start, bpm),
    end: timeToBeats(timeRange.end, bpm),
  };
};

// is rangeA intersecting rangeB
export const isInRange = (rangeA: BeatsRange, rangeB: BeatsRange) => {
  // todo: btw this implies that starts are before the end, which might not be the case
  return !(rangeA.end < rangeB.start || rangeB.end < rangeA.start);
};

export const getItemsInRange = <T extends BeatsRange>(range: BeatsRange, items: Array<T>) => {
  return items.filter((item) => {
    return isInRange(item, range);
  });
};

export const addToRange = <T extends BeatsRange>(range: T, offsetBy: Beats): T => {
  return {
    ...range,
    start: range.start + offsetBy,
    end: range.end + offsetBy,
  };
};

export const subtractFromRange = <T extends BeatsRange>(range: T, offsetBy: Beats): T => {
  return {
    ...range,
    start: range.start - offsetBy,
    end: range.end - offsetBy,
  };
};
