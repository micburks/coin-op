// @flow

import React from 'react';

export const MachineContext = React.createContext({});

export function useMachine() {
  const machine = React.useContext(MachineContext);
  const [ctx, setCtx] = React.useState(machine.ctx);

  React.useEffect(() => {
    const unsubscribe = machine.subscribe((_, newCtx) => setCtx(newCtx));
    return unsubscribe;
  }, [machine]);

  return [
    machine.ctx,
    machine.transition.bind(machine),
  ];
}

export function State(props) {
  const machine = React.useContext(MachineContext);
  const [state, setState] = React.useState(machine.state);

  React.useEffect(() => {
    const unsubscribe = machine.subscribe(newState => setState(newState));
    return unsubscribe;
  });

  if (state === props.is) {
    return props.children;
  } else {
    return null;
  }
}
