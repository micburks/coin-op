const store = new Map();

module.exports.Machine = class Machine {
  constructor(steps, init) {
    this.steps = steps;
    this.state = init;
    this.context = {};
  }
  transition(target) {
    return (...args) => {
      const transition = this.state.to(target);

      const currentStep = this.steps[this.state];
      const toStep = this.steps[transition];

      /*
      console.log('current', currentStep, currentStep && currentStep[target]);
      console.log('toStep', toStep, this.steps[toStep]);
      */

      let nextStep;
      if (currentStep && currentStep[target]) {
        // { [from]: { [to] } }
        console.log('calling currentStep')
        nextStep = currentStep[target];
      } else if (toStep) {
        console.log('calling toStep')
        // { [from.to(to)] }
        nextStep = toStep;
      }

      if (nextStep) {
        // Leaving current step
        const onLeave = this.steps[this.state.onLeave()];
        onLeave && onLeave(...args);

        // TODO: make async
        // Transition
        this.state = nextStep(...args) || FSM.error; // ?

        // Entering new current step
        const onEnter = this.steps[this.state.onEnter()];
        onEnter && onEnter(...args);
      } else {
        this.state = FSM.error;
      }
    };
  }
}

class State {
  constructor(parentString = null) {
    const token = Math.random().toString(36).substring(7);
    if (parentString) {
      this.asString = `${parentString}-${token}`;
    } else {
      this.asString = token;
    }
  }
  to(toState) {
    return getNestedState(this, toState);
  }
  toString() {
    return this.asString;
  }
  onEnter() {
    return getNestedState(this, 'enter');
  }
  onLeave() {
    return getNestedState(this, 'leave');
  }
}

function getNestedState(from, to) {
  if (store.has(from)) {
    const nestedMap = store.get(from);
    if (!nestedMap.has(to)) {
      nestedMap.set(to, new State(from.toString()));
    }
    return nestedMap.get(to);
  }
}

const FSM = {};
FSM.createState = function createState(n = 0) {
  if (n === 0) {
    const state = new State();
    store.set(state, new Map());
    return state;
  } else {
    return [...Array(n)].map(() => {
      const state = new State();
      store.set(state, new Map());
      return state;
    });
  }
}
FSM.error = FSM.createState();
FSM.all = FSM.createState();
module.exports.FSM = FSM;