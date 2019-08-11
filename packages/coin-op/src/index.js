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
    if (!destination instanceof State) {
      throw new Error('The first argument to transition() must be another `State`');
    }
    const source = this.state;
    const previousCtx = this.ctx;

    let newCtx = this.ctx;
    const setCtx = maybeCallback => {
      if (typeof maybeCallback === 'function') {
        const callback = maybeCallback;
        const maybeNewCtx = callback(previousCtx);
        if (maybeNewCtx instanceof Promise) {
          const promise = maybeNewCtx;
          /*
          promise.then(res => {
            // TODO: This is probably hacky
            // It would actually be nice to have historical evidence of what
            // actions were dispatched - reduxy
            if (res) {
              this.ctx = {
                ...this.ctx,
                ...res,
              };
            }
          });
          */
        } else if (maybeNewCtx) {
          newCtx = {...newCtx, ...maybeNewCtx};
        }
      } else if (typeof maybeCallback === 'object') {
        const ctxPartial = maybeCallback;
        newCtx = {...newCtx, ...ctxPartial};
      } else {
        throw new Error('setCtx must be passed an object or a function');
      }
    }

    function shouldProceed(canProceed) {
      return (typeof canProceed === 'undefined') || canProceed;
    }

    const leaveSource = this.state.getTransition(onLeave);
    const transition = this.state.getTransition(destination);
    const enterDestination = destination.getTransition(onEnter);

    let canProceed = true;
    try {
      canProceed = leaveSource(data, setCtx);
      canProceed = shouldProceed(canProceed) && transition(data, setCtx);
      canProceed = shouldProceed(canProceed) && enterDestination(data, setCtx);
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
    if (!shouldProceed(canProceed)) {
      this.ctx = previousCtx;
      this.state = source;
      return;
    }

    // leave
    // - call without bailing (some might be cleanup?)
    // - if error was thronw in one, go to error state
    // - otherwise follow canProceed
    // - use newCtx for following stpes
    // transition
    // - call and bail if one fails
    // - rollback on canProceed=false
    // - use newState and newCtx for following stpes
    // enter
    // - call and bail if one fails
    // - rollback on canProceed=false
    // - commit newState and newCtx

    // async setCtx

    // TODO: add support for multiple callbacks?

    // TODO: Potential bug here if you need to do cleanup in `onLeave`, but an
    // exception is thrown in an earlier transition
    // In this case, the machine transitions to `error` without running `onLeave`

    // Right now just letting the promise go and assuming the user will call
    // `transition` from there to the next state
    // No way to cancel this right now

    // Successful transition
    this.state = destination;
    this.ctx = newCtx;

    for (let listener of this.listeners.values()) {
      listener(this.state, this.ctx);
    }
  };
}

const noop = () => {};
export class State {
  constructor(id) {
    this.id = id;
    this.transitions = new WeakMap();
  }
  to(destination, transition) {
    if (!destination instanceof State) {
      throw new Error('The first argument to state.to() must be another `State`');
    }
    this.transitions.set(destination, transition);
  }
  onEnter(transition) {
    this.transitions.set(onEnter, transition);
  }
  onLeave(transition) {
    this.transitions.set(onLeave, transition);
  }
  getTransition(destination) {
    return this.transitions.get(destination) || noop;
  }
}

export function createState(n = 0) {
  return getSome((i) => {
    return new State(i);
  });
}

const onEnter = new State('onEnter');
const onLeave = new State('onLeave');

