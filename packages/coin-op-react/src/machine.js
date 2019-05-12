import {Machine, FSM} from '@micburks/coin-op';
import getSome from 'get-some';

const [init, submitting, submitted, error] = getSome(() => FSM.createState());
export const states = {init, submitting, submitted, error};
const steps = {
  [init.to(submitting)]() {
    console.log('lkjsdf');
    return submitting;
  },
  [submitting.to(submitted)]() {
    return submitted;
  },
  [submitting.to(error)]() {
  },
  [error.to(init)](){
  },
};

export const machine = new Machine(steps, init);
