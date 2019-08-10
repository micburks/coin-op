import getSome from 'get-some';

const store = new Map();
let counter = 0;

export class Machine {
  constructor(steps, keySteps, initialCtx) {
    if (!keySteps || !keySteps.init) {
      throw new Error('Machine created without specifying `init` step');
    }
    this.steps = steps;
    this.init = keySteps.init;
    this.error = keySteps.error;
    this.state = this.init;
    this.ctx = initialCtx || {};
    this.listeners = new Map();
    this.errorStack = [];
  }
  subscribe(fn) {
    const id = counter++;
    this.listeners.set(id, fn);
    return () => this.listeners.delete(id);
  }
  async transition(destination, data) {
    const source = this.state;
    const previousCtx = this.ctx;
    const transitions = this.state.getTransitions(destination);

    let newCtx = this.ctx;
    async function setCtx(maybeCallback) {
      if (typeof maybeCallback === 'function') {
        const callback = maybeCallback;
        const maybeNewCtx = await callback(this.ctx);
        if (maybeNewCtx) {
          newCtx = {...newCtx, ...maybeNewCtx};
        }
      } else if (typeof maybeCallback === 'object') {
        const ctxPartial = maybeCallback;
        newCtx = {...newCtx, ...ctxPartial};
      } else {
        throw new Error('setCtx must be passed an object or a function');
      }
    }
    
    for await (const transition of transitions) {
      let canProceed;
      try {
        canProceed = await transition(data, setCtx);
      } catch (e) {
        // error => rollback
        if (!this.error) {
          console.error('No error state specified');
          throw e;
        }
        this.ctx = previousCtx;
        this.state = this.error;
        this.errorStack.push(e);
        return;
      }
      // undefined => implicit proceed
      // true => proceed
      // falsy => rollback
      if (typeof canProceed !== 'undefined' && !canProceed) {
        this.ctx = previousCtx;
        this.state = source;
        return;
      }
    }

    // Success
    this.state = destination;
    this.ctx = newCtx;

    for (let listener of this.listeners.values()) {
      listener(this.state, this.ctx);
    }
  };
}

function addToMapArray(map, key, value) {
  if (map.has(key)) {
    const values = map.get(key);
    values.push(value);
    map.set(key, values);
  } else {
    map.set(key, [value]);
  }
}

export class State {
  constructor(id) {
    this.id = id;
    this.transitions = new WeakMap();
  }
  to(destination, transition) {
    if (!destination instanceof State) {
      throw new Error('The first argument to state.to() must be another `State`');
    }
    addToMapArray(this.transitions, destination, transition);
  }
  onEnter(transition) {
    addToMapArray(this.transitions, onEnter, transition);
  }
  onLeave(transition) {
    addToMapArray(this.transitions, onLeave, transition);
  }
  getTransitions(destination) {
    return this.transitions.get(destination) || [];
  }
}

export function createState(n = 0) {
  return getSome((i) => {
    return new State(i);
  });
}

const onEnter = new State('onEnter');
const onLeave = new State('onLeave');

