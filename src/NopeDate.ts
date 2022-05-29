import { NopePrimitive } from './NopePrimitive';
import { NopeReference } from './NopeReference';
import { Rule } from './types';

type T = string | number | Date;

export class NopeDate extends NopePrimitive<T> {
  private message: string;
  protected _type = 'object';

  public before(
    beforeDate: T | NopeReference,
    message = `Date must be before ${beforeDate.toString()}`,
  ) {
    const rule: Rule<T> = (entry, context) => {
      if (this.isEmpty(entry)) {
        return;
      }

      const resolvedBeforeDate =
        beforeDate instanceof NopeReference && context ? context[beforeDate.key] : beforeDate;

      if (new Date(entry as Date) >= new Date(resolvedBeforeDate)) {
        return message;
      }
    };

    return this.test(rule);
  }

  public after(afterDate: T | NopeReference, message = `Date must be after ${afterDate}`) {
    const rule: Rule<T> = (entry, context) => {
      if (this.isEmpty(entry)) {
        return;
      }

      const resolvedAfterDate =
        afterDate instanceof NopeReference && context ? context[afterDate.key] : afterDate;

      if (new Date(entry as Date) <= new Date(resolvedAfterDate)) {
        return message;
      }
    };

    return this.test(rule);
  }

  private parseDate(entry?: any) {
    let value = entry;

    if (this.isEmpty(entry) || entry instanceof Date) {
      value = entry;
    } else if (!isNaN(+new Date(entry))) {
      value = new Date(entry);
    } else {
      const ms = new Date(entry);

      if (isNaN(+ms)) {
        throw this.message;
      }

      value = new Date(ms);
    }

    return value;
  }

  public validate(
    entry?: any,
    context?: Record<string | number, unknown>,
  ): string | undefined | any {
    let value;

    try {
      value = this.parseDate(entry);
    } catch (error) {
      return error;
    }

    return super.validate(value, context);
  }
  public validateAsync(
    entry?: any,
    context?: Record<string | number, unknown>,
  ): Promise<string | undefined | any> {
    let value;

    try {
      value = this.parseDate(entry);
    } catch (error) {
      return Promise.resolve(error);
    }

    return super.validateAsync(value, context);
  }

  public constructor(message = 'The field is not a valid date') {
    super();
    this.message = message;
  }
}
