import { MockedAudioContext } from './MockedAudioContext';

export const createMockedAudioContext = () => {
  // as unknown because MockedAudioContext is missing some stuff...
  return (new MockedAudioContext() as unknown) as AudioContext;
};
