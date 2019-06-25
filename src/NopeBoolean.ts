import NopePrimitive from './NopePrimitive';
import { Rule } from './types';

class NopeBoolean extends NopePrimitive<boolean> {
  public true(message = 'Input must be true') {
    const rule: Rule<boolean> = entry => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry !== true) {
        return message;
      }
    };

    this.validationRules.push(rule);

    return this;
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

    this.validationRules.push(rule);

    return this;
  }
}

export default NopeBoolean;
