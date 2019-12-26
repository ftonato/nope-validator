import NopePrimitive from './NopePrimitive';
import { Rule } from './types';

class NopeNumber extends NopePrimitive<number> {
  private message = 'The field is not a number';

  public integer(message = 'Input must be an integer') {
    const rule: Rule<number> = entry => {
      console.log('Integer: ' + entry);
      if (this.isEmpty(entry)) {
        return;
      }

      if (entry !== Math.floor(entry as number)) {
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
      if (this.isEmpty(entry)) {
        return;
      }

      if ((entry as number) <= size) {
        return message;
      }
    };

    return this.test(rule);
  }

  public lessThan(size: number, message = 'Input is too large') {
    const rule: Rule<number> = entry => {
      if (this.isEmpty(entry)) {
        return;
      }

      if ((entry as number) >= size) {
        return message;
      }
    };

    return this.test(rule);
  }

  public atLeast(size: number, message = 'Input is too small') {
    const rule: Rule<number> = entry => {
      if (this.isEmpty(entry)) {
        return;
      }

      if ((entry as number) < size) {
        return message;
      }
    };

    return this.test(rule);
  }

  public atMost(size: number, message = 'Input is too large') {
    const rule: Rule<number> = entry => {
      if (this.isEmpty(entry)) {
        return;
      }

      if ((entry as number) > size) {
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

  public validate(entry?: any, context?: object | undefined): string | undefined {
    const value = !!entry ? Number(entry) : entry;

    if (!this.isEmpty(value) && Number.isNaN(value)) return this.message;

    return super.validate(value, context);
  }

  public constructor(message: string = 'The field is not a valid number') {
    super();
    this.message = message;
  }
}

export default NopeNumber;
