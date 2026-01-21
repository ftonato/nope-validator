import { Rule, Validatable } from './types';
import { NopePrimitive } from './NopePrimitive';
import { deepEquals, isNil, runValidators } from './utils';
import { NopeObject } from './NopeObject';

function ofType(entry: any, primitive: any) {
  let done = false;
  return entry.reduce(function (previous: any, next: any) {
    if (done) {
      return previous;
    }
    return previous.then(function (error: any) {
      if (error) {
        done = true;
        return error;
      }

      return primitive.validateAsync(next);
    });
  }, Promise.resolve());
}

export class NopeArray<T> implements Validatable<T[]> {
  protected _type = 'object';
  public validationRules: Rule<T[]>[] = [];
  public ofShape: Validatable<T> | NopeObject | null = null;

  public getType() {
    return this._type;
  }

  public required(message = 'This field is required') {
    const rule: Rule<T[]> = (entry) => {
      if (isNil(entry)) {
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
      if (isNil(entry)) {
        return;
      }

      if (entry.some((value) => primitive.getType() !== typeof value)) {
        return message;
      }

      const error = entry.find((value) => primitive.validate(value as any));

      if (error) {
        return message;
      }
    };

    return this.test(rule);
  }

  public ofAsync(
    primitive: Validatable<T> | NopeObject,
    message = 'One or more elements are of invalid type',
  ) {
    this.ofShape = primitive;

    const rule: Rule<T[]> = (entry) => {
      if (isNil(entry)) {
        return;
      }

      if (entry.some((value) => primitive.getType() !== typeof value)) {
        return message;
      }

      return ofType(entry, primitive).then((error?: string) => (error && message) || undefined);
    };

    return this.test(rule);
  }

  public minLength(length: number, message = 'Input is too short') {
    const rule: Rule<T[]> = (entry) => {
      if (isNil(entry)) {
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
      if (isNil(entry)) {
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
      if (isNil(entry)) {
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
      if (isNil(entry)) {
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
      if (isNil(entry)) {
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
      if (isNil(entry) || entry.length === 0) {
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
    return runValidators(this.validationRules, entry, context).then(
      (error: NopePrimitive<T[]> | string | undefined) => {
        if (error instanceof NopePrimitive) {
          return error.validateAsync(entry, context);
        } else if (error) {
          return error;
        }
      },
    );
  }
}
