import NopePrimitive from './NopePrimitive';
import NopeReference from './NopeReference';
import { Rule } from './types';

type T = string | number | Date;

class NopeDate extends NopePrimitive<T> {
  public before(beforeDate: T, message = `Date must be before ${beforeDate.toString()}`) {
    const rule: Rule<T> = (entry, context) => {
      if (entry === null || entry === undefined) {
        return;
      }

      const resolvedBeforeDate =
        beforeDate instanceof NopeReference && context ? context[beforeDate.key] : beforeDate;

      if (new Date(entry) >= new Date(resolvedBeforeDate)) {
        return message;
      }
    };

    this.validationRules.push(rule);

    return this;
  }

  public after(afterDate: T, message = `Date must be after ${afterDate}`) {
    const rule: Rule<T> = (entry, context) => {
      if (entry === null || entry === undefined) {
        return;
      }

      const resolvedAfterDate =
        afterDate instanceof NopeReference && context ? context[afterDate.key] : afterDate;

      if (new Date(entry) <= new Date(resolvedAfterDate)) {
        return message;
      }
    };

    this.validationRules.push(rule);

    return this;
  }
}

export default NopeDate;
