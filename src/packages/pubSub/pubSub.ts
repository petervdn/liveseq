export type PubSub<Payload> = {
  dispatch: (payload: Payload) => void;
  subscribe: (callback: (payload: Payload) => void) => () => void;
  dispose: () => void;
};

// TODO: remove this and replace with streams
export const createPubSub = <Payload>(): PubSub<Payload> => {
  let subscriptions: Array<(payload: Payload) => void> = [];

  const subscribe = (callback: (payload: Payload) => void) => {
    subscriptions.push(callback);

    const unsubscribe = () => {
      const index = subscriptions.indexOf(callback);
      // mutation!
      index !== -1 && subscriptions.splice(index, 1);
    };

    return unsubscribe;
  };

  const dispatch = (payload: Payload) => {
    subscriptions.forEach((callback) => {
      callback(payload);
    });
  };

  const dispose = () => {
    subscriptions = [];
  };

  return {
    subscribe,
    dispatch,
    dispose,
  };
};
