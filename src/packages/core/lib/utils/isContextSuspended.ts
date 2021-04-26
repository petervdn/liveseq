export const isContextSuspended = (audioContext: AudioContext) => {
  return audioContext.state === 'suspended';
};
