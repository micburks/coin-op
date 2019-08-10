import {Machine, createState} from '@micburks/coin-op';
import getSome from 'get-some';

const initialCtx = {
  email: null,
};
const [init, submitting, submitted, error] = createState();
const states = {init, submitting, submitted, error};
const machine = new Machine(states, {init, error}, initialCtx);

// options:
// calling setState and returning new state
// returning new state data -- how to block a transition?
// getting a ctx object you can change - {state, data}

// ??
/*
init.to(submitting, async (data, setCtx) => {});
init.to(submitting, async (data, [ctx, setCtx]) => {});
*/

init.to(submitting, async (data, setCtx) => {
  if (!data.email) {
    return false; // prevent transition
    throw new Error('email is required'); // go to error state
  }
  setCtx({
    email: data.email,
  });
  /* alternative, if you need the current ctx value, you can pass a function
  setCtx(ctx => ({
    email: data.email,
  }));
  */
  // return true; // implicit
});

// returning void - complete transition
// returning true/false - whether to complete transition
// throwing error - go to error state

submitting.to(submitted, async (state) => {
  return true;
});

export {
  states,
  machine,
};
