import { wrapInRange } from './wrapInRange';
import { getRangeDuration } from './getRangeDuration';
import { setStart } from './setStart';
import { clampRange } from './clampRange';
import { createRangeFromDuration } from './createRangeFromDuration';
import type { Beats, BeatsRange } from '../../core/lib/types';

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
