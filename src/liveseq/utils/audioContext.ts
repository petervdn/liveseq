/* eslint-disable @typescript-eslint/no-explicit-any */
export const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
