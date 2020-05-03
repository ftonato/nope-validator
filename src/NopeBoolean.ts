import NopePrimitive from './NopePrimitive';
import { Rule } from './types';

class NopeBoolean extends NopePrimitive<boolean> {
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

  public validate(entry?: any, context?: object | undefined): string | undefined {
    const value = entry === undefined || entry === null ? entry : !!entry;

    return super.validate(value, context);
  }
}

export default NopeBoolean;
