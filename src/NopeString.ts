import { NopePrimitive } from './NopePrimitive';
import { Nil, Rule } from './types';
import { urlRegex, emailRegex } from './consts';

export class NopeString extends NopePrimitive<string> {
  protected _type = 'string';

  public validate(entry?: any, context?: Record<string, unknown>): string | undefined {
    const value = !!entry ? String(entry) : entry;

    return super.validate(value, context);
  }

  public validateAsync(
    entry?: any,
    context?: Record<string, unknown>,
  ): Promise<string | undefined> {
    const value = !!entry ? String(entry) : entry;

    return super.validateAsync(value, context);
  }

  protected isEmpty(value: string | Nil): boolean {
    return value === undefined || value === null || `${value}`.trim().length === 0;
  }

  public regex(regex: RegExp, message = "Doesn't satisfy the rule"): this {
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

  public url(message = 'Input is not a valid url'): this {
    return this.regex(urlRegex, message);
  }

  public email(message = 'Input is not a valid email'): this {
    return this.regex(emailRegex, message);
  }

  public min(length: number, message?: string): this {
    return this.greaterThan(length, message);
  }

  public max(length: number, message?: string): this {
    return this.lessThan(length, message);
  }

  public greaterThan(length: number, message = 'Input is too short'): this {
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

  public lessThan(length: number, message = 'Input is too long'): this {
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

  public exactLength(length: number, message = `Must be at exactly of length ${length}`) {
    const rule: Rule<string> = (entry) => {
      if (this.isEmpty(entry)) {
        return;
      }

      const value = entry as string;
      if (value.length !== length) {
        return message;
      }
    };

    return this.test(rule);
  }
}
