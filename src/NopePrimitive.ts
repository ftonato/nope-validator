import { NopeReference } from './NopeReference';
import { AsyncRule, Context, Nil, Rule, RuleResult, Validatable } from './types';
import { isNil, resolveNopeRef, resolveNopeRefsFromKeys } from './utils';

export abstract class NopePrimitive<T> implements Validatable<T> {
  protected validationRules: (Rule<T> | AsyncRule<T>)[] = [];
  protected _type = 'undefined';
  protected _entry: T | undefined;
  private _defaultValue: T | undefined;
  private _hasDefault = false;
  private _isNullable = false;
  private _isOptional: boolean | undefined = undefined;

  public getType() {
    return this._type;
  }

  protected isEmpty(entry: T | Nil): boolean {
    return isNil(entry);
  }

  public default(value: T) {
    this._defaultValue = value;
    this._hasDefault = true;
    return this;
  }

  public getDefault(): T | undefined {
    return this._hasDefault ? this._defaultValue : undefined;
  }

  public nullable() {
    this._isNullable = true;
    return this;
  }

  public nonNullable(message = 'This field must not be null') {
    this._isNullable = false;

    const rule: Rule<T> = (entry) => {
      if (entry === null) {
        return message;
      }
    };

    return this.test(rule);
  }

  public defined(message = 'This field must be defined') {
    this._isOptional = false;

    const rule: Rule<T> = (entry) => {
      if (entry === undefined) {
        return message;
      }
    };

    return this.test(rule);
  }

  public optional() {
    this._isOptional = true;
    return this;
  }

  public notRequired() {
    return this.optional();
  }

  public required(message = 'This field is required') {
    this._isOptional = false;

    const rule: Rule<T> = (entry) => {
      if (this.isEmpty(entry)) {
        return message;
      }
    };

    return this.test(rule);
  }

  public notAllowed(message = 'Field is not allowed') {
    const rule: Rule<T> = (entry) => {
      if (!this.isEmpty(entry)) {
        return message;
      }
    };

    return this.test(rule);
  }

  public when(
    keys: string[] | string,
    conditionObject: {
      is: boolean | ((...args: any) => boolean);
      then: NopePrimitive<any>;
      otherwise: NopePrimitive<any>;
    },
  ) {
    const ctxKeys = Array.isArray(keys) ? keys : [keys];

    const rule: Rule<T> = (_, context) => {
      const resolvedConditionValues = resolveNopeRefsFromKeys(ctxKeys, context);

      const values = [...resolvedConditionValues];

      const condIs = conditionObject.is;

      const result =
        typeof condIs === 'function'
          ? condIs(...values)
          : resolvedConditionValues.every((val: any) => val === condIs);

      return result ? conditionObject.then : conditionObject.otherwise;
    };

    return this.test(rule);
  }

  public oneOf(options: (T | NopeReference | Nil)[] | NopeReference, message = 'Invalid option') {
    const rule: Rule<T> = (entry, context) => {
      if (entry === undefined) {
        return;
      }

      let resolved: any[];

      if (options instanceof NopeReference) {
        resolved = resolveNopeRef(options, context);
      } else {
        resolved = options.map((option) => resolveNopeRef(option, context));
      }

      if (resolved.indexOf(entry) === -1) {
        return message;
      }
    };

    return this.test(rule);
  }

  public notOneOf(options: (T | NopeReference | Nil)[], message = 'Invalid Option') {
    const rule: Rule<T> = (entry, context) => {
      const resolvedOptions = options.map((option) => resolveNopeRef(option, context));

      if (resolvedOptions.indexOf(entry) !== -1) {
        return message;
      }
    };

    return this.test(rule);
  }

  public test(rule: Rule<T> | AsyncRule<T>) {
    this.validationRules.push(rule);

    return this;
  }

  public isValid(entry?: T | Nil, context?: Context): Promise<boolean> {
    return this.validateAsync(entry, context).then((error) => !error);
  }

  public isValidSync(entry?: T | Nil, context?: Record<string | number, unknown>): boolean {
    return !this.validate(entry, context);
  }

  private _applyDefault(entry?: T | Nil): T | Nil | undefined {
    if (entry === undefined && this._hasDefault) {
      return this._defaultValue;
    }
    return entry;
  }

  /**
   * @param entry - The value to be validated
   * @param context - Used for internal reference resolving. Do not pass this.
   */
  public validate(entry?: T | Nil, context?: Record<string | number, unknown>): string | undefined {
    const resolved = this._applyDefault(entry);

    if (resolved === null && this._isNullable) {
      return undefined;
    }

    this._entry = <T>resolved;

    for (const rule of this.validationRules) {
      const error = rule(this._entry, context);

      if (error instanceof NopePrimitive) {
        return error.validate(this._entry, context);
      } else if (error) {
        return error as string;
      }
    }
  }

  public validateAsync(entry?: T | Nil, context?: Context): Promise<string | undefined> {
    const resolved = this._applyDefault(entry);

    if (resolved === null && this._isNullable) {
      return Promise.resolve(undefined);
    }

    this._entry = <T>resolved;

    const run = async (): Promise<string | undefined> => {
      for (const rule of this.validationRules) {
        let error: RuleResult<T> | undefined;

        try {
          error = await Promise.resolve(rule(this._entry, context));
        } catch (rejected) {
          error = rejected as RuleResult<T>;
        }

        if (error instanceof NopePrimitive) {
          return error.validateAsync(this._entry, context);
        } else if (error) {
          return error as string;
        }
      }
    };

    return run();
  }
}
