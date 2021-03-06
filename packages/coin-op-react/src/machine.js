// @flow

import {Machine, createState} from '@micburks/coin-op';

const initialCtx = {
  email: null,
};

const [init, submitting, submitted, error] = createState();
export const states = {
  init,
  submitting,
  submitted,
  error
};

export const machine = new Machine(
  states,
  {init, error},
  initialCtx
);

// options:
// calling setState and returning new state
// returning new state data -- how to block a transition?
// getting a ctx object you can change - {state, data}

// ??
/*
init.to(submitting, async (data, setCtx) => {});
init.to(submitting, async (data, [ctx, setCtx]) => {});
*/

init.to(submitting, (data, setCtx) => {
  if (!data.email) {
    return false; // prevent transition
    // or
    throw new Error('email is required'); // go to error state
  }
  setCtx({
    email: data.email,
  });
  // alternative, if you need the current ctx value, you can pass a function
  // setCtx(ctx => ({
  //   email: data.email,
  // }));
});

submitting.onEnter((data, setCtx) => {
  // fetch(`/something?email=${ctx.email}`)
  setCtx(async (ctx) => {
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
    machine.transition(submitted);
  });
});

submitting.to(submitted, (data, setCtx) => {
});

