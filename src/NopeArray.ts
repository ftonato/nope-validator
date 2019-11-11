import { Rule, Validatable, Nil } from './types';
import NopePrimitive from './NopePrimitive';

class NopeArray<T> implements Validatable<T[]> {
  protected _type: string = 'object';
  public validationRules: Rule<T[]>[] = [];

  public getType() {
    return this._type;
  }

  public required(message = 'This field is required') {
    const rule: Rule<T[]> = entry => {
      if (entry === undefined || entry === null) {
        return message;
      }
    };

    return this.test(rule);
  }

  public of(primitive: Validatable<T>, message = 'One or more elements are of invalid type') {
    const rule: Rule<T[]> = entry => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry.some(value => primitive.getType() !== typeof value)) {
        return message;
      }

      const error = entry.find(value => primitive.validate(value));

      if (error) {
        return message;
      }
    };

    return this.test(rule);
  }

  public minLength(length: number, message = 'Input is too short') {
    const rule: Rule<T[]> = entry => {
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
    const rule: Rule<T[]> = entry => {
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
    const rule: Rule<T[]> = entry => {
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
    const rule: Rule<T[]> = entry => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry.some(value => values.indexOf(value) === -1)) {
        return message;
      }
    };

    return this.test(rule);
  }

  public every(callback: Function, message = 'Input does not satisfy condition') {
    const rule: Rule<T[]> = entry => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry.some(value => !callback(value))) {
        return message;
      }
    };

    return this.test(rule);
  }

  public some(callback: Function, message = 'Input does not satisfy condition') {
    const rule: Rule<T[]> = entry => {
      if (entry === undefined || entry === null || entry.length === 0) {
        return;
      }

      if (!entry.some(value => callback(value))) {
        return message;
      }
    };

    return this.test(rule);
  }

  public test(rule: Rule<T[]>) {
    this.validationRules.push(rule);

    return this;
  }

  public validate(entry?: T[] | Nil, context?: object | undefined): string | undefined {
    for (const rule of this.validationRules) {
      const error = rule(entry, context);

      if (error instanceof NopePrimitive) {
        return error.validate(entry, context);
      } else if (error) {
        return `${error}`;
      }
    }
  }
}

export default NopeArray;
