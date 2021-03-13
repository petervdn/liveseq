import {
  addMusicTime,
  beatsToTime,
  musicTimeToBeats,
  musicTimeToTime,
  normalizeMusicTime,
  timeToBeats,
} from './musicTime';
import type { Beats, Bpm, TimeInSeconds } from './time';

export {};

it('normalizes musicTime', () => {
  expect(normalizeMusicTime([1])).toEqual([1, 0, 0, 0]);
  expect(normalizeMusicTime([1, 2])).toEqual([1, 2, 0, 0]);
  expect(normalizeMusicTime([1, 6])).toEqual([2, 2, 0, 0]);
  expect(normalizeMusicTime([1, 2, 3, 1])).toEqual([1, 3, 0, 0]);
  expect(normalizeMusicTime([0, 0, 0, 16])).toEqual([1, 0, 0, 0]);
  expect(normalizeMusicTime([0, 0, 16, 0])).toEqual([1, 0, 0, 0]);
});

it('normalizes musicTime with different settings', () => {
  expect(normalizeMusicTime([1, 3], { beatsPerBar: 3 })).toEqual([2, 0, 0, 0]);
  expect(normalizeMusicTime([1, 2, 6], { beatsPerBar: 3, sixteenthsPerBeat: 6 })).toEqual([
    2,
    0,
    0,
    0,
  ]);
});

it('converts musicTime to beats', () => {
  expect(musicTimeToBeats([1, 0, 0, 0])).toBe(4);
  expect(musicTimeToBeats([1, 1, 0, 0])).toBe(5);
  expect(musicTimeToBeats([1, 1, 2, 0])).toBe(5.5);
  expect(musicTimeToBeats([1, 1, 3, 1])).toBe(6);
});
//
it('converts musicTime to beats with different settings', () => {
  expect(musicTimeToBeats([1, 0, 0, 0], { beatsPerBar: 3 })).toBe(3);
  expect(musicTimeToBeats([1, 0, 10, 0], { beatsPerBar: 3, sixteenthsPerBeat: 10 })).toBe(4);
});

it('converts beats to time', () => {
  expect(beatsToTime(120 as Beats, 120 as Bpm)).toBe(60);
});

it('converts time to beats', () => {
  expect(timeToBeats(60 as TimeInSeconds, 120 as Bpm)).toBe(120);
});

it('converts musicTime to time', () => {
  expect(musicTimeToTime([0, 120], 120 as Bpm)).toBe(60);
});

it('adds musicTimes', () => {
  expect(addMusicTime([0], [0])).toEqual([0, 0, 0, 0]);
  expect(addMusicTime([1], [1])).toEqual([2, 0, 0, 0]);
  expect(addMusicTime([1, 2, 3, 4], [1, 2, 3, 4])).toEqual([3, 3, 2, 0]);
});
