import { Rule, Context, Validatable } from './types';
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
  private _defaultValue: T[] | undefined;
  private _hasDefault = false;
  private _isNullable = false;

  public getType() {
    return this._type;
  }

  public default(value: T[]) {
    this._defaultValue = value;
    this._hasDefault = true;
    return this;
  }

  public getDefault(): T[] | undefined {
    return this._hasDefault ? this._defaultValue : undefined;
  }

  public nullable() {
    this._isNullable = true;
    return this;
  }

  public nonNullable(message = 'This field must not be null') {
    this._isNullable = false;

    const rule: Rule<T[]> = (entry) => {
      if (entry === null) {
        return message;
      }
    };

    this.validationRules.push(rule);
    return this;
  }

  public defined(message = 'This field must be defined') {
    const rule: Rule<T[]> = (entry) => {
      if (entry === undefined) {
        return message;
      }
    };

    this.validationRules.push(rule);
    return this;
  }

  public optional() {
    return this;
  }

  public notRequired() {
    return this.optional();
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

  public length(size: number, message = `Must have exactly ${size} items`) {
    const rule: Rule<T[]> = (entry) => {
      if (isNil(entry)) {
        return;
      }

      if (!Array.isArray(entry)) {
        return message;
      }

      if (entry.length !== size) {
        return message;
      }
    };

    return this.test(rule);
  }

  public test(rule: Rule<T[]>) {
    this.validationRules.push(rule);

    return this;
  }

  private _applyDefault(entry?: T[] | null): T[] | null | undefined {
    if (entry === undefined && this._hasDefault) {
      return this._defaultValue;
    }
    return entry;
  }

  public isValid(entry?: T[] | null, context?: Context): Promise<boolean> {
    return this.validateAsync(entry, context).then((error) => !error);
  }

  public isValidSync(entry?: T[] | null, context?: Record<string | number, unknown>): boolean {
    return !this.validate(entry, context);
  }

  public validate(
    entry?: T[] | null,
    context?: Record<string | number, unknown>,
  ): string | undefined {
    const resolved = this._applyDefault(entry);

    if (resolved === null && this._isNullable) {
      return undefined;
    }

    for (const rule of this.validationRules) {
      const error = rule(resolved, context);

      if (error instanceof NopePrimitive) {
        return error.validate(resolved, context);
      } else if (error) {
        return `${error}`;
      }
    }
  }

  public validateAsync(
    entry?: T[] | null,
    context?: Record<string | number, unknown>,
  ): Promise<string | undefined> {
    const resolved = this._applyDefault(entry);

    if (resolved === null && this._isNullable) {
      return Promise.resolve(undefined);
    }

    return runValidators(this.validationRules, resolved, context).then(
      (error: NopePrimitive<T[]> | string | undefined) => {
        if (error instanceof NopePrimitive) {
          return error.validateAsync(resolved, context);
        } else if (error) {
          return error;
        }
      },
    );
  }
}
