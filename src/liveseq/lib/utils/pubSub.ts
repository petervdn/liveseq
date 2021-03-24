// Usage
// const pubSub = createPubSub<'hello' | 'hi', {message:string}>()
// const unsubscribe = pubSub.subscribe('hello', (props) => {
//   console.log('action:', 'hello', 'props:',props)
// })
// pubSub.dispatch('hello', {message: 'welcome'})
// unsubscribe()
// pubSub.dispatch('hello', {message: 'welcome'})
// pubSub.dispose()

export type PubSub<EventName extends string> = {
  dispatch: (eventName: EventName) => void;
  subscribe: (eventName: EventName, callback: () => void) => () => void;
  dispose: () => void;
};

export const createPubSub = <EventName extends string>(
  onDispatch?: (eventName: EventName) => void,
): PubSub<EventName> => {
  // TODO: use an object to find by eventName without running through the whole array
  let subscriptions: Array<{
    eventName: EventName;
    callback: () => void;
  }> = [];

  const subscribe = (eventName: EventName, callback: () => void) => {
    const subscription = {
      eventName,
      callback,
    };

    subscriptions.push(subscription);

    const unsubscribe = () => {
      const index = subscriptions.indexOf(subscription);
      // mutation!
      index !== -1 && subscriptions.splice(index, 1);
    };

    return unsubscribe;
  };

  const dispatch = (eventName: EventName) => {
    onDispatch && onDispatch(eventName);

    subscriptions.forEach((subscription) => {
      if (subscription.eventName !== eventName) return;

      subscription.callback();
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
