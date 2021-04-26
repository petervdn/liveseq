import type { Beats, Bpm, TimeInSeconds } from '../core/lib/types';
import { beatsToTime } from '../core/lib/time/beatsToTime';
import { timeToBeats } from '../core/lib/time/timeToBeats';

export type MusicTime = [
  bars: number,
  beats?: number,
  sixteenths?: number,
  remainingSixteenths?: number,
];

// todo: these should be part of a musicTime
type MusicTimeOptions = {
  sixteenthsPerBeat?: number;
  beatsPerBar?: number;
};

const DEFAULT_BEATS_PER_BAR = 4;
const DEFAULT_SIXTEENTHS_PER_BEAT = 4;

export const musicTimeToBeats = (
  time: MusicTime,
  {
    beatsPerBar = DEFAULT_BEATS_PER_BAR,
    sixteenthsPerBeat = DEFAULT_SIXTEENTHS_PER_BEAT,
  }: MusicTimeOptions = {},
): Beats => {
  const [bars, beats = 0, sixteenths = 0, remainingSixteenth = 0] = time;

  return (bars * beatsPerBar +
    beats +
    (sixteenths + remainingSixteenth) / sixteenthsPerBeat) as Beats;
};

export const normalizeMusicTime = (
  time: MusicTime,
  {
    beatsPerBar = DEFAULT_BEATS_PER_BAR,
    sixteenthsPerBeat = DEFAULT_SIXTEENTHS_PER_BEAT,
  }: MusicTimeOptions = {},
): MusicTime => {
  const end = musicTimeToBeats(time, { sixteenthsPerBeat, beatsPerBar });

  const totalSixteenths = end * sixteenthsPerBeat;
  const flooredSixteenths = Math.floor(totalSixteenths);
  const sixteenthsPerBar = sixteenthsPerBeat * beatsPerBar;
  const bars = Math.floor(flooredSixteenths / sixteenthsPerBar);
  const beats = Math.floor((flooredSixteenths - bars * sixteenthsPerBar) / sixteenthsPerBeat);

  return [
    bars,
    beats,
    flooredSixteenths - bars * sixteenthsPerBar - beats * sixteenthsPerBeat,
    totalSixteenths - flooredSixteenths,
  ];
};

export const musicTimeToTime = (
  musicTime: MusicTime,
  bpm: Bpm,
  {
    beatsPerBar = DEFAULT_BEATS_PER_BAR,
    sixteenthsPerBeat = DEFAULT_SIXTEENTHS_PER_BEAT,
  }: MusicTimeOptions = {},
): number => beatsToTime(musicTimeToBeats(musicTime, { beatsPerBar, sixteenthsPerBeat }), bpm);

export const timeToMusicTime = (time: TimeInSeconds, bpm: Bpm): MusicTime =>
  normalizeMusicTime([0, timeToBeats(time, bpm)]);

// is a before b
export const isBefore = (a: MusicTime, b: MusicTime) => musicTimeToBeats(a) < musicTimeToBeats(b);

export const isSameTime = (a: MusicTime, b: MusicTime) => {
  return musicTimeToBeats(a) === musicTimeToBeats(b);
};

export const addMusicTime = (a: MusicTime, b: MusicTime) => {
  return normalizeMusicTime([0, musicTimeToBeats(a) + musicTimeToBeats(b)]);
};
