import React from 'react';
import {useMachine, State} from './lib.js';
import {states} from './machine.js';

const {init, submitting, submitted, error} = states;

const prevent = fn => e => {
  e.preventDefault();
  return fn();
}

function SignupForm (props) {
  return (
    <form onSubmit={prevent(props.onSubmit)}>
      <input type="submit" value="Submit!"/>
    </form>
  );
}

function Loading () {
  const [n, setN] = React.useState(0);
  const ellipsis = '.'.repeat(n);
  React.useEffect(() => {
    const timerId = setTimeout(() => setN((n+1)%4), 400);
    return () => clearTimeout(timerId);
  })
  return (
    <span>Loading{ellipsis}</span>
  );
}

export default function MyComponent() {
  const transition = useMachine();

  return (
    <div>
      <State is={init}>
        <p>Welcome!</p>
        <SignupForm onSubmit={transition(submitting)}/>
      </State>

      <State is={submitting}>
        <p>Sending...</p>
        <Loading/>
      </State>

      <State is={submitted}>
        <p>Thank you!</p>
      </State>

      <State is={error}>
        <p style={{color: 'red'}}>Hmm... there appears to be an error</p>
      </State>
    </div>
  );
}
