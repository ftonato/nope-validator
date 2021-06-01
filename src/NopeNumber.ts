import { NopePrimitive } from './NopePrimitive';
import { Rule } from './types';

export class NopeNumber extends NopePrimitive<number> {
  private message = 'The field is not a number';
  protected _type = 'number';

  public integer(message = 'Input must be an integer') {
    const rule: Rule<number> = (entry) => {
      if (this.isEmpty(entry)) {
        return;
      }

      if (entry !== Math.floor(entry as number)) {
        return message;
      }
    };

    return this.test(rule);
  }

  public min(size: number, message?: string) {
    this.greaterThan(size, message);
    return this;
  }

  public max(size: number, message?: string) {
    this.lessThan(size, message);
    return this;
  }

  public greaterThan(size: number, message = 'Input is too small') {
    const rule: Rule<number> = (entry) => {
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
    const rule: Rule<number> = (entry) => {
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
    const rule: Rule<number> = (entry) => {
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
    const rule: Rule<number> = (entry) => {
      if (this.isEmpty(entry)) {
        return;
      }

      if ((entry as number) > size) {
        return message;
      }
    };

    return this.test(rule);
  }

  public between(
    sizeStart: number,
    sizeEnd: number,
    atLeastMessage = 'Input is too small',
    atMostMessage = 'Input is too large',
  ) {
    if (sizeStart && sizeEnd && sizeStart > sizeEnd) {
      const rule: Rule<unknown> = () => {
        throw Error(
          'between must receive an initial size (sizeStart) smaller than the final size (sizeEnd) parameter',
        );
      };

      return this.test(rule);
    }

    this.atLeast(sizeStart, atLeastMessage);
    this.atMost(sizeEnd, atMostMessage);

    return this;
  }

  public positive(message = 'Input must be positive') {
    this.greaterThan(0, message);
    return this;
  }

  public negative(message = 'Input must be negative') {
    this.lessThan(0, message);
    return this;
  }

  public validate(entry?: any, context?: Record<string | number, unknown>): string | undefined {
    const value = !!entry ? Number(entry) : entry;

    if (!this.isEmpty(value) && Number.isNaN(value)) {
      return this.message;
    }

    return super.validate(value, context);
  }

  public validateAsync(
    entry?: any,
    context?: Record<string | number, unknown>,
  ): Promise<string | undefined> {
    const value = !!entry ? Number(entry) : entry;

    if (!this.isEmpty(value) && Number.isNaN(value)) {
      return Promise.resolve(this.message);
    }

    return super.validateAsync(value, context);
  }

  public constructor(message = 'The field is not a valid number') {
    super();
    this.message = message;
  }
}
