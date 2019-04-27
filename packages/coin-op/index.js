const store = new Map();

module.exports.Machine = class Machine {
  constructor(steps, init) {
    this.steps = steps;
    this.state = init;
  }
  transition(target) {
    const transition = this.state.to(target);
    
    const currentStep = this.steps[this.state];
    const toStep = this.steps[transition];

    // TODO: transition functions
    
    let nextStep;
    if (currentStep && currentStep[target]) {
      nextStep = currentStep[target]();
    } else if (toStep && toStep[target]) {
      nextStep = toStep[target]();
    }
    if (nextStep) {
      this.state = nextStep;
    } else {
      this.state = FSM.error;
    }
  }
}

class State {
  constructor(parentString = null) {
    const token = Math.random().toString(36).substring(7);
    if (parentString) {
      this.asString = `${parentString}-to-${token}`;
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
    // ?
    // return getNestedState(this, toState);
  }
  onLeave() {
    // ?
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