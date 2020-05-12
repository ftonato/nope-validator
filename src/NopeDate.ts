import NopePrimitive from './NopePrimitive';
import NopeReference from './NopeReference';
import { Rule } from './types';

type T = string | number | Date;

class NopeDate extends NopePrimitive<T> {
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

      if ((entry as Date) >= new Date(resolvedBeforeDate)) {
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

      if ((entry as Date) <= new Date(resolvedAfterDate)) {
        return message;
      }
    };

    return this.test(rule);
  }

  public validate(entry?: any, context?: object | undefined): string | undefined {
    let value = entry;

    if (this.isEmpty(entry) || entry instanceof Date) {
      value = entry;
    } else if (!isNaN(entry)) {
      value = new Date(entry);
    } else {
      const ms = Date.parse(entry);

      if (isNaN(ms)) return this.message;

      value = new Date(ms);
    }

    return super.validate(value, context);
  }

  public constructor(message = 'The field is not a valid date') {
    super();
    this.message = message;
  }
}

export default NopeDate;
