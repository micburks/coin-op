const assert = require('assert');
const getSome = require('get-some');
const {Machine, createState} = require('./index.js');
const chalk = require('chalk');

const [init, revenue, expenses, error] = createState();
const states = {init, revenue, expenses, error};

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

expenses.to(init, () => {
  throw new Error('refuse to move to init');
});

expenses.to(revenue, () => {
  console.log('expenses to revenue - fails');
  return false;
});

(async () => {
  const machine = new Machine(states, {init, error});
  assertWithMessage(machine.state === init, 'machine starts in init');

  await machine.transition(revenue);
  assertWithMessage(machine.state === revenue, 'machine transitions to revenue');

  await machine.transition(expenses);
  assertWithMessage(machine.state === expenses, 'machine transitions to expenses');

  await machine.transition(revenue);
  assertWithMessage(machine.state === expenses, 'machine prevents transition to revenue');

  await machine.transition(init);
  assertWithMessage(machine.state === error, 'machine transitions to error instead of init');
})();

function assertWithMessage(expectation, message) {
  try {
    assert(expectation);
    console.log(chalk.green('++ success on ' + message));
  } catch(e) {
    console.log(chalk.red('-- failed on ' + message));
  }
}
