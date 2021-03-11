import type { Opaque } from 'type-fest';

export type Beats = Opaque<number, 'Beats'>;
export type Bpm = Opaque<number, 'Bpm'>;
export type TimeInSeconds = Opaque<number, 'TimeInSeconds'>;

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
  const totalBeats = musicTimeToBeats(time, { sixteenthsPerBeat, beatsPerBar });

  const totalSixteenths = totalBeats * sixteenthsPerBeat;
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

export const beatsToTime = (beats: Beats, bpm: number): number => {
  return (beats * 60) / bpm;
};

export const timeToBeats = (time: number, bpm: number): Beats => {
  return ((time / 60) * bpm) as Beats;
};

export const musicTimeToTime = (
  musicTime: MusicTime,
  bpm: number,
  {
    beatsPerBar = DEFAULT_BEATS_PER_BAR,
    sixteenthsPerBeat = DEFAULT_SIXTEENTHS_PER_BEAT,
  }: MusicTimeOptions = {},
): number => beatsToTime(musicTimeToBeats(musicTime, { beatsPerBar, sixteenthsPerBeat }), bpm);

export const timeToMusicTime = (time: number, bpm: number): MusicTime =>
  normalizeMusicTime([0, timeToBeats(time, bpm)]);

// is a before b
export const isBefore = (a: MusicTime, b: MusicTime) => musicTimeToBeats(a) < musicTimeToBeats(b);

export const isSameTime = (a: MusicTime, b: MusicTime) => {
  return musicTimeToBeats(a) === musicTimeToBeats(b);
};

export const addMusicTime = (a: MusicTime, b: MusicTime) => {
  return normalizeMusicTime([0, musicTimeToBeats(a) + musicTimeToBeats(b)]);
};
