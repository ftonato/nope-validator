import { Rule, Validatable } from './types';
import NopePrimitive from './NopePrimitive';
import { deepEquals } from './utils';
import NopeObject from './NopeObject';

class NopeArray<T> implements Validatable<T[]> {
  protected _type = 'object';
  public validationRules: Rule<T[]>[] = [];
  public ofShape: Validatable<T> | NopeObject | null = null;

  public getType() {
    return this._type;
  }

  public required(message = 'This field is required') {
    const rule: Rule<T[]> = (entry) => {
      if (entry === undefined || entry === null) {
        return message;
      }
    };

    return this.test(rule);
  }

  public of(
    primitive: Validatable<T> | NopeObject,
    message = 'One or more elements are of invalid type',
  ) {
    this.ofShape = primitive;

    const rule: Rule<T[]> = (entry) => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry.some((value) => primitive.getType() !== typeof value)) {
        return message;
      }

      const error = entry.find((value) => primitive.validate(value));

      if (error) {
        return message;
      }
    };

    return this.test(rule);
  }

  public minLength(length: number, message = 'Input is too short') {
    const rule: Rule<T[]> = (entry) => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry.length <= length) {
        return message;
      }
    };

    return this.test(rule);
  }

  public maxLength(length: number, message = 'Input is too long') {
    const rule: Rule<T[]> = (entry) => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry.length >= length) {
        return message;
      }
    };

    return this.test(rule);
  }

  public mustContain(value: T, message = 'Input does not contain required value') {
    const rule: Rule<T[]> = (entry) => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry.indexOf(value) === -1) {
        return message;
      }
    };

    return this.test(rule);
  }

  public hasOnly(values: T[], message = 'Input elements must correspond to value values') {
    const rule: Rule<T[]> = (entry) => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (
        entry.some((value) => {
          if (typeof value === 'object') {
            return !values.find((v) => deepEquals(value, v));
          }
          return values.indexOf(value) === -1;
        })
      ) {
        return message;
      }
    };

    return this.test(rule);
  }

  public every(callback: (value: T) => boolean, message = 'Input does not satisfy condition') {
    const rule: Rule<T[]> = (entry) => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry.some((value) => !callback(value))) {
        return message;
      }
    };

    return this.test(rule);
  }

  public some(callback: (value: T) => boolean, message = 'Input does not satisfy condition') {
    const rule: Rule<T[]> = (entry) => {
      if (entry === undefined || entry === null || entry.length === 0) {
        return;
      }

      if (!entry.some((value) => callback(value))) {
        return message;
      }
    };

    return this.test(rule);
  }

  public test(rule: Rule<T[]>) {
    this.validationRules.push(rule);

    return this;
  }

  public validate(
    entry?: T[] | null,
    context?: Record<string | number, unknown>,
  ): string | undefined {
    for (const rule of this.validationRules) {
      const error = rule(entry, context);

      if (error instanceof NopePrimitive) {
        return error.validate(entry, context);
      } else if (error) {
        return `${error}`;
      }
    }
  }

  public validateAsync(
    entry?: T[] | null,
    context?: Record<string | number, unknown>,
  ): Promise<string | undefined> {
    for (const rule of this.validationRules) {
      const error = rule(entry, context);

      if (error instanceof NopePrimitive) {
        return error.validateAsync(entry, context);
      } else if (error) {
        return Promise.resolve(`${error}`);
      }
    }
    return Promise.resolve(undefined);
  }
}

export default NopeArray;
