import NopePrimitive from './NopePrimitive';
import { Rule } from './types';

class NopeNumber extends NopePrimitive<number> {
  protected _type: string = 'number';

  public integer(message = 'Input must be an integer') {
    const rule: Rule<number> = entry => {
      if (entry === undefined || entry == null) {
        return;
      }

      if (entry !== Math.floor(entry)) {
        return message;
      }
    };

    return this.test(rule);
  }

  /**
   * @deprecated alias for greaterThan()
   */
  public min(size: number, message?: string) {
    return this.greaterThan(size, message);
  }

  /**
   * @deprecated alias for lessThan()
   */
  public max(size: number, message?: string) {
    return this.lessThan(size, message);
  }

  public greaterThan(size: number, message = 'Input is too small') {
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

  public lessThan(size: number, message = 'Input is too large') {
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

  public atLeast(size: number, message = 'Input is too small') {
    const rule: Rule<number> = entry => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry < size) {
        return message;
      }
    };

    return this.test(rule);
  }

  public atMost(size: number, message = 'Input is too large') {
    const rule: Rule<number> = entry => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry > size) {
        return message;
      }
    };

    return this.test(rule);
  }

  public positive(message = 'Input must be positive') {
    return this.greaterThan(0, message);
  }

  public negative(message = 'Input must be negative') {
    return this.lessThan(0, message);
  }
}

export default NopeNumber;
