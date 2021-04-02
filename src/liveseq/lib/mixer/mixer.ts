type CreateMixerChannelProps = {
  audioContext: AudioContext;
  masterGain: GainNode;
  gain: number;
  pan: number;
};

export type ChannelMixer = ReturnType<typeof createMixerChannel>;

const createMixerChannel = ({ audioContext, masterGain, gain, pan }: CreateMixerChannelProps) => {
  const { currentTime } = audioContext;
  const channelGainNode = audioContext.createGain();
  channelGainNode.gain.setValueAtTime(gain, currentTime);
  const stereoPannerNode = audioContext.createStereoPanner();
  stereoPannerNode.pan.setValueAtTime(pan, currentTime);
  stereoPannerNode.connect(channelGainNode);
  channelGainNode.connect(masterGain);

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
  const masterGain = audioContext.createGain();
  masterGain.connect(audioContext.destination);
  // TODO: keep track of channels for the dispose
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const channels = {};

  const getMasterGain = () => masterGain;

  const addChannel = (gain: number, pan: number) => {
    // TODO: save to simple store (gotta write a store that returns a dispose function)
    const channelMixer = createMixerChannel({
      audioContext,
      gain,
      masterGain,
      pan,
    });

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
    getMasterGain,
    dispose: () => {
      // TODO: call dispose in each mixer channel
    },
  };
};
