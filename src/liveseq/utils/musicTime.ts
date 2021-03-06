export type MusicTime = [
  bars: number,
  beats?: number,
  sixteenths?: number,
  remainingSixteenths?: number,
];

// todo better name
export type MusicTimeObject = {
  bars: number;
  beats: number;
  sixteenths: number;
  remainingSixteenth: number;
};

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
  const bars = time[0];
  const beats = time[1] || 0;
  const sixteenths = time[2] || 0;
  const remainingSixteenth = time[3] || 0;
  return bars * beatsPerBar + beats + (sixteenths + remainingSixteenth) / sixteenthsPerBeat;
};

export const musicTimeToObject = (
  time: MusicTime,
  {
    beatsPerBar = DEFAULT_BEATS_PER_BAR,
    sixteenthsPerBeat = DEFAULT_SIXTEENTHS_PER_BEAT,
  }: MusicTimeOptions = {},
): MusicTimeObject => {
  const totalBeats = musicTimeToBeats(time, { sixteenthsPerBeat, beatsPerBar });

  const totalSixteenths = totalBeats * sixteenthsPerBeat;
  const flooredSixteenths = Math.floor(totalSixteenths);
  const sixteenthsPerBar = sixteenthsPerBeat * beatsPerBar;
  const bars = Math.floor(flooredSixteenths / sixteenthsPerBar);
  const beats = Math.floor((flooredSixteenths - bars * sixteenthsPerBar) / sixteenthsPerBeat);

  return {
    bars,
    beats,
    sixteenths: flooredSixteenths - bars * sixteenthsPerBar - beats * sixteenthsPerBeat,
    remainingSixteenth: totalSixteenths - flooredSixteenths,
  };
};

export const beatsToTime = (beats: number, bpm: number): number => (beats * 60) / bpm;

export const musicTimeToTime = (
  musicTime: MusicTime,
  bpm: number,
  {
    beatsPerBar = DEFAULT_BEATS_PER_BAR,
    sixteenthsPerBeat = DEFAULT_SIXTEENTHS_PER_BEAT,
  }: MusicTimeOptions = {},
): number => beatsToTime(musicTimeToBeats(musicTime, { beatsPerBar, sixteenthsPerBeat }), bpm);
