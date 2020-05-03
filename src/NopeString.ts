import NopePrimitive from './NopePrimitive';
import { Rule } from './types';
import { urlRegex, emailRegex } from './consts';

class NopeString extends NopePrimitive<string> {
  protected _type = 'string';

  public validate(entry?: any, context?: object | undefined): string | undefined {
    const value = !!entry ? String(entry) : entry;

    return super.validate(value, context);
  }

  protected isEmpty(value: string | null | undefined) {
    return value === undefined || value === null || `${value}`.trim().length === 0;
  }

  public regex(regex: RegExp, message = "Doesn't satisfy the rule") {
    const rule: Rule<string> = (entry) => {
      if (this.isEmpty(entry)) {
        return;
      }

      if (!regex.test(entry as string)) {
        return message;
      }
    };

    return this.test(rule);
  }

  public url(message = 'Input is not a valid url') {
    return this.regex(urlRegex, message);
  }

  public email(message = 'Input is not a valid email') {
    return this.regex(emailRegex, message);
  }

  /**
   * @deprecated alias for greaterThan()
   */
  public min(length: number, message?: string) {
    return this.greaterThan(length, message);
  }

  /**
   * @deprecated alias for lessThan()
   */
  public max(length: number, message?: string) {
    return this.lessThan(length, message);
  }

  public greaterThan(length: number, message = 'Input is too short') {
    const rule: Rule<string> = (entry) => {
      if (this.isEmpty(entry)) {
        return;
      }

      const value = entry as string;
      if (value.length <= length) {
        return message;
      }
    };

    return this.test(rule);
  }

  public lessThan(length: number, message = 'Input is too long') {
    const rule: Rule<string> = (entry) => {
      if (this.isEmpty(entry)) {
        return;
      }

      const value = entry as string;
      if (value.length >= length) {
        return message;
      }
    };

    return this.test(rule);
  }

  public atLeast(length: number, message = 'Input is too short') {
    const rule: Rule<string> = (entry) => {
      if (this.isEmpty(entry)) {
        return;
      }

      const value = entry as string;
      if (value.length < length) {
        return message;
      }
    };

    return this.test(rule);
  }

  public atMost(length: number, message = 'Input is too long') {
    const rule: Rule<string> = (entry) => {
      if (this.isEmpty(entry)) {
        return;
      }

      const value = entry as string;
      if (value.length > length) {
        return message;
      }
    };

    return this.test(rule);
  }
}

export default NopeString;
