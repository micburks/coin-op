import React from 'react';
import {MachineContext} from './lib.js';
import {machine} from './machine.js';
import MyComponent from './component.js';

export default function App() {
  return (
    <MachineContext.Provider value={machine}>
      <MyComponent/>
    </MachineContext.Provider>
  );
}
