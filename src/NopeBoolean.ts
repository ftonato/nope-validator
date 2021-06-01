import { NopePrimitive } from './NopePrimitive';
import { Rule } from './types';
import { isNil } from './utils';

export class NopeBoolean extends NopePrimitive<boolean> {
  protected _type = 'boolean';

  public true(message = 'Input must be true') {
    const rule: Rule<boolean> = (entry) => {
      if (this.isEmpty(entry)) {
        return;
      }

      if (entry !== true) {
        return message;
      }
    };

    return this.test(rule);
  }

  public false(message = 'Input must be false') {
    const rule: Rule<boolean> = (entry) => {
      if (this.isEmpty(entry)) {
        return;
      }

      if (entry !== false) {
        return message;
      }
    };

    return this.test(rule);
  }

  public validate(entry?: any, context?: Record<string | number, unknown>): string | undefined {
    const value = isNil(entry) ? entry : !!entry;

    return super.validate(value, context);
  }

  public validateAsync(
    entry?: any,
    context?: Record<string | number, unknown>,
  ): Promise<string | undefined> {
    const value = isNil(entry) ? entry : !!entry;

    return super.validateAsync(value, context);
  }
}
