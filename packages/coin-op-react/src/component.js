// @flow

import React from 'react';
import {useMachine, State} from './lib.js';
import {states} from './machine.js';

function SignupForm (props) {
  const [email, setEmail] = React.useState('');

  function submit(e) {
    e.preventDefault();
    if (email !== '') {
      props.onSubmit({email});
    }
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  return (
    <form onSubmit={submit}>
      <input type="text" value={email} onChange={handleEmailChange} />
      <input type="submit" value="Submit!" />
    </form>
  );
}

function Loading () {
  const [n, setN] = React.useState(0);
  const ellipsis = '.'.repeat(n);
  React.useEffect(() => {
    const timerId = setTimeout(() => {
      setN((n + 1) % 4);
    }, 400);
    return () => clearTimeout(timerId);
  })
  return (
    <span>Loading{ellipsis}</span>
  );
}

export default function MyComponent() {
  const [ctx, transition] = useMachine(/*, {}*/); // - alternative? supply initialCtx - for testing?
  const {init, submitting, submitted, error} = states;

  React.useEffect(() => {
    setTimeout(() => transition(error), 5000);
  });

  return (
    <div>
      <State is={init}>
        <p>Welcome!</p>
        <SignupForm onSubmit={data => transition(submitting, data)}/>
      </State>

      <State is={submitting}>
        <p>Sending to {ctx.email}...</p>
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
