// Usage
// const pubSub = createPubSub<'hello' | 'hi', {message:string}>()
// const unsubscribe = pubSub.subscribe('hello', (props) => {
//   console.log('action:', 'hello', 'props:',props)
// })
// pubSub.dispatch('hello', {message: 'welcome'})
// unsubscribe()
// pubSub.dispatch('hello', {message: 'welcome'})
// pubSub.dispose()

export const createPubSub = <EventName extends string, CallbackProps>(
  onDispatch?: (actionType: EventName, props: CallbackProps) => void,
) => {
  // TODO: use an object to find by actionType without running through the whole array
  let subscriptions: Array<{
    actionType: EventName;
    callback: (props: CallbackProps) => void;
  }> = [];

  const subscribe = (actionType: EventName, callback: (props: CallbackProps) => void) => {
    const subscription = {
      actionType,
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

  const dispatch = (actionType: EventName, props: CallbackProps) => {
    onDispatch && onDispatch(actionType, props);

    subscriptions.forEach((subscription) => {
      if (subscription.actionType !== actionType) return;

      subscription.callback(props);
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
