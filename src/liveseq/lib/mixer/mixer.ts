type CreateMixerChannelProps = {
  audioContext: AudioContext;
  destination: GainNode | AudioDestinationNode;
  gain: number;
  pan: number;
};

export type MixerChannel = ReturnType<typeof createMixerChannel>;

// TODO: need to be able to subscribe
const createMixerChannel = ({ audioContext, destination, gain, pan }: CreateMixerChannelProps) => {
  const { currentTime } = audioContext;
  const channelGainNode = audioContext.createGain();
  channelGainNode.gain.setValueAtTime(gain, currentTime);
  const stereoPannerNode = audioContext.createStereoPanner();
  stereoPannerNode.pan.setValueAtTime(pan, currentTime);
  stereoPannerNode.connect(channelGainNode);
  channelGainNode.connect(destination);

  return {
    audioContext,
    getGainNode: () => {
      return channelGainNode;
    },
    getStereoPannerNode: () => {
      return stereoPannerNode;
    },
    dispose: () => {
      // TODO
    },
  };
};

export type Mixer = ReturnType<typeof createMixer>;

export const createMixer = (audioContext: AudioContext) => {
  const masterChannel = createMixerChannel({
    gain: 1,
    pan: 0,
    audioContext,
    destination: audioContext.destination,
  });

  // const channels = [];

  const getMasterChannel = () => masterChannel;

  const addChannel = (gain: number, pan: number) => {
    // TODO: save to simple store (gotta write a store that returns a dispose function)
    const channelMixer = createMixerChannel({
      audioContext,
      gain,
      destination: masterChannel.getGainNode(),
      pan,
    });
    // const getIsMuted = () => {
    //   return state.isMuted;
    // };
    //
    // const setIsMuted = (isMuted: boolean) => {
    //   if (getIsMuted() === isMuted) return;
    //
    //   setState({
    //     isMuted,
    //   });
    // };
    return {
      ...channelMixer,
      dispose: () => {
        channelMixer.dispose();
        // TODO: remove from channels
      },
    };
  };

  return {
    addChannel,
    getMasterChannel,
    dispose: () => {
      // TODO: call dispose in each mixer channel
    },
  };
};
