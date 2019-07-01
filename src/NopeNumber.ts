import NopePrimitive from './NopePrimitive';
import { Rule } from './types';

class NopeNumber extends NopePrimitive<number> {
  public integer(message = 'Input must be an integer'){
    const rule: Rule<number> = entry => {
      if (entry === undefined || entry === null) {
        return;
      }
      if(!Number.isInteger(entry)){
        return message;
      }
    }

    return this.test(rule);
  }

  public min(size: number, message = 'Input is too small') {
    const rule: Rule<number> = entry => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry <= size) {
        return message;
      }
    };

    return this.test(rule);
  }

  public max(size: number, message = 'Input is too large') {
    const rule: Rule<number> = entry => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry >= size) {
        return message;
      }
    };

    return this.test(rule);
  }

  public positive(message = 'Input must be positive') {
    return this.min(0, message);
  }

  public negative(message = 'Input must be negative') {
    return this.max(0, message);
  }
}

export default NopeNumber;
