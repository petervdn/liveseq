import { isContextSuspended } from './isContextSuspended';
import { errorMessages } from '../../../sequencer/lib/errors';

export const resumeAudioContext = (audioContext: AudioContext) => {
  return new Promise<void>((resolve, reject) => {
    if (!(audioContext instanceof window.AudioContext)) {
      reject(new TypeError(errorMessages.cantPlayWithoutProperAudioContext()));
    }

    isContextSuspended(audioContext)
      ? audioContext
          .resume()
          .then(resolve)
          .catch((error) => {
            if (isContextSuspended(audioContext)) {
              reject(new Error(errorMessages.contextSuspended()));
            }
            reject(error);
          })
      : resolve();
  });
};
