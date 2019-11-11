import { Rule, Validatable, Nil } from './types';
import NopePrimitive from './NopePrimitive';

class NopeArray implements Validatable<any[]> {
  public validationRules: Rule<any[]>[] = [];

  public required(message = 'This field is required') {
    const rule: Rule<any[]> = entry => {
      if (entry === undefined || entry === null) {
        return message;
      }
    };

    return this.test(rule);
  }

  public minLength(length: number, message = 'Input is too short') {
    const rule: Rule<any[]> = entry => {
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
    const rule: Rule<any[]> = entry => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry.length >= length) {
        return message;
      }
    };

    return this.test(rule);
  }

  public mustContain(value: any, message = 'Input does not contain required value') {
    const rule: Rule<any[]> = entry => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry.indexOf(value) === -1) {
        return message;
      }
    };

    return this.test(rule);
  }

  public hasOnly(values: any[], message = 'Input elements must correspond to value values') {
    const rule: Rule<any[]> = entry => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry.some(value => values.indexOf(value) === -1)) {
        return message;
      }
    };

    return this.test(rule);
  }

  public whereEvery(callback: Function, message = 'Input does not satisfy condition') {
    const rule: Rule<any[]> = entry => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry.some(value => !callback(value))) {
        return message;
      }
    };

    return this.test(rule);
  }

  public whereSome(callback: Function, message = 'Input does not satisfy condition') {
    const rule: Rule<any[]> = entry => {
      if (entry === undefined || entry === null || entry.length === 0) {
        return;
      }

      if (!entry.some(value => callback(value))) {
        return message;
      }
    };

    return this.test(rule);
  }

  public test(rule: Rule<any[]>) {
    this.validationRules.push(rule);

    return this;
  }

  public validate(entry?: any[] | Nil, context?: object | undefined): string | undefined {
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
