import { musicTimeToBeats, musicTimeToNormalizedObject } from './musicTime';

export {};

it('normalizes musicTime', () => {
  expect(musicTimeToNormalizedObject([1])).toEqual({
    bars: 1,
    beats: 0,
    sixteenths: 0,
    remainingSixteenth: 0,
  });
  expect(musicTimeToNormalizedObject([1, 2])).toEqual({
    bars: 1,
    beats: 2,
    sixteenths: 0,
    remainingSixteenth: 0,
  });
  expect(musicTimeToNormalizedObject([1, 6])).toEqual({
    bars: 2,
    beats: 2,
    sixteenths: 0,
    remainingSixteenth: 0,
  });
  expect(musicTimeToNormalizedObject([1, 2, 3, 1])).toEqual({
    bars: 1,
    beats: 3,
    sixteenths: 0,
    remainingSixteenth: 0,
  });
  expect(musicTimeToNormalizedObject([0, 0, 0, 16])).toEqual({
    bars: 1,
    beats: 0,
    sixteenths: 0,
    remainingSixteenth: 0,
  });
  expect(musicTimeToNormalizedObject([0, 0, 16, 0])).toEqual({
    bars: 1,
    beats: 0,
    sixteenths: 0,
    remainingSixteenth: 0,
  });
});

it('converts musicTime to beats', () => {
  expect(musicTimeToBeats([1, 0, 0, 0])).toBe(4);
  expect(musicTimeToBeats([1, 1, 0, 0])).toBe(5);
  expect(musicTimeToBeats([1, 1, 2, 0])).toBe(5.5);
  expect(musicTimeToBeats([1, 1, 3, 1])).toBe(6);
});
