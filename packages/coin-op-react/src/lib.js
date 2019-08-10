import React from 'react';

export function useMachine() {
  const machine = React.useContext(MachineContext);

  return machine.transition.bind(machine);
}

export function State(props) {
  const machine = React.useContext(MachineContext);
  const [state, setState] = React.useState(machine.state);

  React.useEffect(() => {
    const unsubscribe = machine.subscribe(setState);
    return unsubscribe;
  })

  if (state === props.is) {
    return props.children;
  } else {
    return null;
  }
}
