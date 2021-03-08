import { musicTimeToBeats, musicTimeToObject, musicTimeToTime } from './musicTime';

export {};

it('normalizes musicTime', () => {
  expect(musicTimeToObject([1])).toEqual({
    bars: 1,
    beats: 0,
    sixteenths: 0,
    remainingSixteenth: 0,
  });
  expect(musicTimeToObject([1, 2])).toEqual({
    bars: 1,
    beats: 2,
    sixteenths: 0,
    remainingSixteenth: 0,
  });
  expect(musicTimeToObject([1, 6])).toEqual({
    bars: 2,
    beats: 2,
    sixteenths: 0,
    remainingSixteenth: 0,
  });
  expect(musicTimeToObject([1, 2, 3, 1])).toEqual({
    bars: 1,
    beats: 3,
    sixteenths: 0,
    remainingSixteenth: 0,
  });
  expect(musicTimeToObject([0, 0, 0, 16])).toEqual({
    bars: 1,
    beats: 0,
    sixteenths: 0,
    remainingSixteenth: 0,
  });
  expect(musicTimeToObject([0, 0, 16, 0])).toEqual({
    bars: 1,
    beats: 0,
    sixteenths: 0,
    remainingSixteenth: 0,
  });
});

it('normalizes musicTime with different settings', () => {
  expect(musicTimeToObject([1, 3], { beatsPerBar: 3 })).toEqual({
    bars: 2,
    beats: 0,
    sixteenths: 0,
    remainingSixteenth: 0,
  });
  expect(musicTimeToObject([1, 2, 6], { beatsPerBar: 3, sixteenthsPerBeat: 6 })).toEqual({
    bars: 2,
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
//
it('converts musicTime to beats with different settings', () => {
  expect(musicTimeToBeats([1, 0, 0, 0])).toBe(4);
  expect(musicTimeToBeats([1, 1, 0, 0])).toBe(5);
  expect(musicTimeToBeats([1, 1, 2, 0])).toBe(5.5);
  expect(musicTimeToBeats([1, 1, 3, 1])).toBe(6);
});

it('converts musicTime to time', () => {
  expect(musicTimeToTime([0, 120], 120)).toBe(60);
});
