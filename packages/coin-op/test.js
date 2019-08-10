const assert = require('assert');
const getSome = require('get-some');
const {Machine, FSM} = require('./index.js');

const [init, revenue, expenses, error] = getSome(() => FSM.createState());

/*
const steps = {
  [init]: {
    [revenue]() {
      console.log('init to revenue')
      return revenue;
    },
  },
  [revenue]: {
    [init]() {
      console.log('revenue to init');
      return init;
    },
    [expenses]() {
      console.log('revenue to expenses');
      return expenses; // return 'from' state
    },
  },
  [expenses.onEnter()]() {
    console.log('on enter called');
  },
  [expenses.onLeave()]() {
    console.log('on leave called');
  },
  [expenses.to(revenue)]() {
    console.log('expenses to revenue');
    return; // or return undefined
  },
  [FSM.error]: {
    [FSM.all]() {
      return;
    },
  },
};
*/

init.to(revenue, () => {
  console.log('init to revenue')
});

revenue.to(init, () => {
  console.log('revenue to init');
});

revenue.to(expenses, () => {
  console.log('revenue to expenses');
});

expenses.onEnter(() => {
  console.log('on enter called');
});

expenses.onLeave(() => {
  console.log('on leave called');
});

expenses.to(revenue, () => {
  console.log('expenses to revenue - fails');
  return false;
});

const machine = new Machine(steps, {init, error});
assertWithMessage(machine.state === init, 'machine starts in init');

machine.transition(revenue);
assertWithMessage(machine.state === revenue, 'machine transitions to revenue');

machine.transition(expenses);
assertWithMessage(machine.state === expenses, 'machine transitions to expenses');

machine.transition(revenue);
assertWithMessage(machine.state === error, 'machine transitions to error instead of revenue');

function assertWithMessage(expectation, message) {
  try {
    assert(expectation);
    console.log('success on ' + message);
  } catch(e) {
    console.error('failed on ' + message);
  }
}
