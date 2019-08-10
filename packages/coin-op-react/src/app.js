// @flow

import React from 'react';
import MyComponent from './component.js';
import {MachineContext} from './lib.js';
import {machine} from './machine.js';

export default function App() {
  return (
    <MachineContext.Provider value={machine}>
      <MyComponent/>
    </MachineContext.Provider>
  );
}
