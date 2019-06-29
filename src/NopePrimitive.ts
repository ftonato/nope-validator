import { IValidatable, Nil, Rule } from './types';
import NopeReference from './NopeReference';

abstract class NopePrimitive<T> implements IValidatable<T> {
  protected validationRules: Array<Rule<T>> = [];

  public required(message = 'This field is required') {
    const rule: Rule<T> = entry => {
      if (entry === undefined || entry === null) {
        return message;
      }
    };

    this.validationRules.push(rule);

    return this;
  }

  public oneOf(options: Array<T | NopeReference | Nil>, message = 'Invalid option') {
    const rule: Rule<T> = (entry, context) => {
      const resolver = (option: T | NopeReference | Nil) => {
        if (option instanceof NopeReference && context) {
          return context[option.key];
        }

        return option;
      };

      const resolvedOptions = options.map(resolver);

      if (resolvedOptions.indexOf(entry) === -1) {
        return message;
      }
    };

    this.validationRules.push(rule);

    return this;
  }

  public test(rule: Rule<T>) {
    this.validationRules.push(rule);

    return this;
  }

  /**
   * @param entry - The value to be validated
   * @param context - Used for internal reference resolving. Do not pass this.
   */
  public validate(entry?: T | Nil, context?: object | undefined): string | undefined {
    for (const rule of this.validationRules) {
      const error = rule(entry, context);

      if (error) {
        return error;
      }
    }
  }
}

export default NopePrimitive;
