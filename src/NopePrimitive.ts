import { NopeReference } from './NopeReference';
import { AsyncRule, Context, Nil, Rule, Validatable } from './types';
import { isNil, resolveNopeRef, resolveNopeRefsFromKeys, runValidators } from './utils';

export abstract class NopePrimitive<T> implements Validatable<T> {
  protected validationRules: (Rule<T> | AsyncRule<T>)[] = [];
  protected _type = 'undefined';

  public getType() {
    return this._type;
  }

  protected isEmpty(entry: T | Nil) {
    return isNil(entry);
  }

  public required(message = 'This field is required') {
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

  /**
   * @param entry - The value to be validated
   * @param context - Used for internal reference resolving. Do not pass this.
   */
  public validate(entry?: T | Nil, context?: Record<string | number, unknown>): string | undefined {
    for (const rule of this.validationRules) {
      const error = rule(entry, context);

      if (error instanceof NopePrimitive) {
        return error.validate(entry, context);
      } else if (error) {
        return error as string;
      }
    }
  }

  public validateAsync(entry?: T | Nil, context?: Context): Promise<string | undefined> {
    return runValidators(this.validationRules, entry, context).then((error: any) => {
      if (error instanceof NopePrimitive) {
        return error.validateAsync(entry, context);
      } else if (error) {
        return error;
      }
    });
  }
}
