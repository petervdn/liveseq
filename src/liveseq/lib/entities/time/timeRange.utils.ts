import { timeToBeats } from './musicTime';
import type { BeatsRange, TimeRange } from './timeRange';
import type { Beats, Bpm } from './time';

// TODO: consolidate this stuff with musicTime stuff in their own "timing" directory

export const createRangeFromDuration = (duration: Beats, start = 0 as Beats) => {
  const end = (start + duration) as Beats;

  return {
    start,
    end,
  };
};

export const timeRangeToBeatsRange = (timeRange: TimeRange, bpm: Bpm): BeatsRange => {
  return {
    start: timeToBeats(timeRange.start, bpm),
    end: timeToBeats(timeRange.end, bpm),
  };
};

export const getRangeDuration = (range: BeatsRange): Beats => {
  return (range.end - range.start) as Beats;
};

export const splitRange = (range: BeatsRange, splitAt: Beats): Array<BeatsRange> => {
  const isBetween = range.start < splitAt && range.end > splitAt;

  return isBetween
    ? [
        {
          start: range.start,
          end: splitAt,
        },
        {
          start: splitAt,
          end: range.end,
        },
      ]
    : [range];
};

export const setStart = (range: BeatsRange, start: Beats): BeatsRange => {
  const newStart = Math.min(start, range.end) as Beats;
  return {
    start: newStart,
    end: range.end,
  };
};

export const setEnd = (range: BeatsRange, end: Beats): BeatsRange => {
  const newEnd = Math.max(end, range.start) as Beats;
  return {
    start: range.start,
    end: newEnd,
  };
};

export const splitRangeByDuration = (range: BeatsRange, duration: Beats): Array<BeatsRange> => {
  return splitRange(range, (range.start + duration) as Beats);
};

// moves whole range to new start
export const moveRange = (range: BeatsRange, newStart: Beats): BeatsRange => {
  const difference = newStart - range.start;

  return {
    start: range.start + difference,
    end: range.end + difference,
  } as BeatsRange;
};

// is rangeA intersecting rangeB
export const isInRange = (rangeA: BeatsRange, rangeB: BeatsRange) => {
  // todo: btw this implies that starts are before the end, which might not be the case
  return !(rangeA.end < rangeB.start || rangeB.end < rangeA.start);
};

// given a range and a number of loops, what is the resulting range?
const getLoopedRange = (range: BeatsRange, loops: number): BeatsRange => {
  const times = Math.max(0, loops + 1);
  const newDuration = (getRangeDuration(range) * times) as Beats;
  return createRangeFromDuration(newDuration, range.start);
};

const clampRange = (range: BeatsRange, rangeLimit: BeatsRange): BeatsRange => {
  return {
    start: Math.max(range.start, rangeLimit.start),
    end: Math.min(range.end, rangeLimit.end),
  } as BeatsRange;
};

// TODO: this could be optimized
// returns an array of wrapped ranges representing the range in each loop iteration
export const getWrappedRanges = (
  rangeToWrap: BeatsRange,
  rangeLimit: BeatsRange,
  loops = 0,
): Array<BeatsRange> => {
  const loopedLimit = getLoopedRange(rangeLimit, loops);
  const clampedRangeToWrap = clampRange(rangeToWrap, loopedLimit);

  const startDifference = clampedRangeToWrap.start - rangeLimit.start;

  const clampedRangeDuration = getRangeDuration(clampedRangeToWrap);
  const rangeLimitDuration = getRangeDuration(rangeLimit);

  // if rangeLimit and clampedRangeToWrap start at the same time and have same duration, coveredArea will be 1
  const coveredArea = (startDifference + clampedRangeDuration) / rangeLimitDuration;

  // how many ranges will need to be generated to cover the wrapped range
  const iterations = Math.ceil(coveredArea);

  if (iterations < 1) return [];

  // the result will be an array filled with rangeLimit
  // but the first item and last item are special cases
  const result = new Array(iterations).fill(rangeLimit);
  // gotta set the start time of the first item...
  result[0] = setStart(result[0], clampedRangeToWrap.start);

  if (result.length === 1) return result;

  // ...and end time of the last item
  const durationFraction = coveredArea % 1 || 1;
  result[result.length - 1] = createRangeFromDuration(
    (rangeLimitDuration * durationFraction) as Beats,
    rangeLimit.start,
  );

  return result;
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
