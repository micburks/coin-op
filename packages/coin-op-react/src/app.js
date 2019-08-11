// @flow

import React from 'react';
import ExampleApp from './example-app.js';
import {MachineContext} from './lib.js';
import {machine} from './machine.js';
import styled from 'styled-components';

const AppContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.05);
  font-family: 'Open Sans', sans-serif;
  height: 100%;
  padding-top: 32px;
`;

export default function App() {
  return (
    <MachineContext.Provider value={machine}>
      <AppContainer>
        <ExampleApp/>
      </AppContainer>
    </MachineContext.Provider>
  );
}
