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
): number => {
  const [bars, beats = 0, sixteenths = 0, remainingSixteenth = 0] = time;

  return bars * beatsPerBar + beats + (sixteenths + remainingSixteenth) / sixteenthsPerBeat;
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

export const beatsToTime = (beats: number, bpm: number): number => (beats * 60) / bpm;

export const timeToBeats = (time: number, bpm: number): number => (time / 60) * bpm;

export const musicTimeToTime = (
  musicTime: MusicTime,
  bpm: number,
  {
    beatsPerBar = DEFAULT_BEATS_PER_BAR,
    sixteenthsPerBeat = DEFAULT_SIXTEENTHS_PER_BEAT,
  }: MusicTimeOptions = {},
): number => beatsToTime(musicTimeToBeats(musicTime, { beatsPerBar, sixteenthsPerBeat }), bpm);

export const timeToMusicTime = (time: number, bpm: number): MusicTime => {
  return [0, timeToBeats(time, bpm)];
};

// is a before b
export const isBefore = (a: MusicTime, b: MusicTime) => musicTimeToBeats(a) < musicTimeToBeats(b);

export const isSameTime = (a: MusicTime, b: MusicTime) =>
  musicTimeToBeats(a) === musicTimeToBeats(b);

export const addMusicTime = (a: MusicTime, b: MusicTime): MusicTime => {
  const [a1, a2 = 0, a3 = 0, a4 = 0] = a;
  const [b1, b2 = 0, b3 = 0, b4 = 0] = b;

  return normalizeMusicTime([a1 + b1, a2 + b2, a3 + b3, a4 + b4]);
};

// is rangeA intersecting rangeB
export const isInRange = (
  aStart: MusicTime,
  aEnd: MusicTime,
  bStart: MusicTime,
  bEnd: MusicTime,
) => {
  return !(isBefore(aEnd, bStart) || isBefore(bEnd, aStart));
};
