import NopePrimitive from './NopePrimitive';
import { Rule } from './types';

class NopeBoolean extends NopePrimitive<boolean> {
  protected _type: string = 'boolean';

  public true(message = 'Input must be true') {
    const rule: Rule<boolean> = entry => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry !== true) {
        return message;
      }
    };

    return this.test(rule);
  }

  public false(message = 'Input must be false') {
    const rule: Rule<boolean> = entry => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry !== false) {
        return message;
      }
    };

    return this.test(rule);
  }
}

export default NopeBoolean;
