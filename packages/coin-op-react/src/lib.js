import React from 'react';

export const MachineContext = React.createContext({});

export function useMachine() {
  const machine = React.useContext(MachineContext);

  return machine.transition.bind(machine);
}

export function State(props) {
  const machine = React.useContext(MachineContext);
  const [state, setState] = React.useState(machine.state);

  React.useEffect(() => {
    machine.subscribe(setState);
    return () => machine.unsubscribe(setState);
  })

  if (state === props.is) {
    return props.children;
  } else {
    return null;
  }
}
