const assert = require('assert');
const getSome = require('get-some');
const {Machine, FSM} = require('./index.js');

const [init, revenue, expenses] = getSome(() => FSM.createState());

const steps = {
  [init]: {
    [revenue]() {
      return revenue;
    },
  },
  [revenue]: {
    [init]() {
      return init;
    },
    [expenses]() {
      return expenses; // return 'from' state
    },
  },
  [expenses.onEnter()]() {},
  [expenses.onLeave()]() {},
  [expenses.to(revenue)]() {
    return; // or return undefined
  },
  [FSM.error]: {
    [FSM.all]() {
      return;
    },
  },
};

const machine = new Machine(steps, init);
assertWithMessage(machine.state === init, 'machine starts in init');

machine.transition(revenue);
assertWithMessage(machine.state === revenue, 'machine transitions to revenue');

machine.transition(expenses);
assertWithMessage(machine.state === expenses, 'machine transitions to expenses');

machine.transition(revenue);
assertWithMessage(machine.state === FSM.error, 'machine transitions to error instead of revenue');

function assertWithMessage(expectation, message) {
  try {
    assert(expectation);
    console.log('success on ' + message);
  } catch(e) {
    console.error('failed on ' + message);
  }
}