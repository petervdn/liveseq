import { timeToBeats } from './musicTime';
import type { TimeRange } from './timeRange';
import type { Beats, Bpm } from './time';
import { wrapInRange } from '../utils/wrapInRange';

export type BeatsRange = {
  start: Beats;
  end: Beats;
};

export const createRange = (start: Beats, end: Beats): BeatsRange => {
  return {
    start,
    end,
  };
};

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

export const setStart = <T extends BeatsRange>(range: T, start: Beats): T => {
  return {
    ...range,
    start,
    end: Math.max(range.end, start) as Beats,
  };
};

export const setEnd = <T extends BeatsRange>(range: T, end: Beats): T => {
  return {
    ...range,
    start: Math.min(end, range.start) as Beats,
    end,
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
  return !(rangeA.end <= rangeB.start || rangeA.start >= rangeB.end);
};

// given a range and a number of loops, what is the resulting range?
export const getLoopedRange = (range: BeatsRange, loops: number): BeatsRange => {
  const times = Math.max(0, loops + 1);
  const newDuration = (getRangeDuration(range) * times) as Beats;
  return createRangeFromDuration(newDuration, range.start);
};

// might clamp to an invalid duration, so might return null
export const clampRange = (range: BeatsRange, rangeLimit: BeatsRange): BeatsRange | null => {
  const newRange = {
    start: Math.max(range.start, rangeLimit.start),
    end: Math.min(range.end, rangeLimit.end),
  } as BeatsRange;

  const duration = getRangeDuration(newRange);
  return duration > 0 ? newRange : null;
};

// TODO: this could be optimized
// returns an array of wrapped ranges representing the range in each loop iteration
export const getWrappedRanges = (
  rangeToWrap: BeatsRange,
  rangeLimit: BeatsRange,
  limitLoops = 0,
): Array<BeatsRange & { offset: Beats }> => {
  const times = Math.max(0, limitLoops + 1);
  const rangeLimitDuration = getRangeDuration(rangeLimit);
  const loopedLimitDuration = (rangeLimitDuration * times) as Beats;
  const loopedLimit = createRangeFromDuration(loopedLimitDuration, rangeLimit.start);
  const clampedRangeToWrap = clampRange(rangeToWrap, loopedLimit);

  if (!clampedRangeToWrap) return [];

  const clampedRangeDuration = getRangeDuration(clampedRangeToWrap);

  const startDifference = clampedRangeToWrap.start - rangeLimit.start;
  const firstIteration = Math.floor(startDifference / rangeLimitDuration); // todo: might need to ceil or something
  const wrappedStartDifference = wrapInRange(startDifference, rangeLimit);
  // if rangeLimit and clampedRangeToWrap start at the same time and have same duration, coveredArea will be 1
  const coveredArea = (wrappedStartDifference + clampedRangeDuration) / rangeLimitDuration;

  // how many ranges will need to be generated to cover the wrapped range
  const totalRanges = Math.ceil(coveredArea);

  // console.log({
  //   startDifference,
  //   rangeToWrap,
  //   rangeLimit,
  //   clampedRangeToWrap,
  //   loopedLimit,
  //   firstIteration,
  //   coveredArea,
  //   totalRanges,
  //   // clampedRangeDuration,
  //   // rangeLimitDuration,
  // });

  // the result will be an array filled with rangeLimit
  // but the first item and last item are special cases
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const result = Array.from({ length: totalRanges }, (_, index) => {
    return {
      ...rangeLimit,
      offset: ((index + firstIteration) * rangeLimitDuration) as Beats,
    };
  });

  // TODO: this was wrong, but must be included
  // gotta set the start time of the first item...
  // mutation!
  result[0] = setStart(result[0], wrappedStartDifference as Beats);

  if (result.length === 1) return result;

  // ...and end time of the last item
  const durationFraction = coveredArea % 1 || 1;
  const lastItem = result[result.length - 1];
  // mutation!
  result[result.length - 1] = {
    ...lastItem,
    ...createRangeFromDuration((rangeLimitDuration * durationFraction) as Beats, rangeLimit.start),
  };

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
