import NopePrimitive from './NopePrimitive';
import { Rule } from './types';
import { urlRegex, emailRegex } from './consts';

class NopeString extends NopePrimitive<string> {
  public regex(regex: RegExp, message = 'Doesn\'t satisfy the rule') {
    const rule: Rule<string> = entry => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (!regex.test(entry)) {
        return message;
      }
    };

    this.validationRules.push(rule);

    return this;
  }

  public url(message = 'Input is not a valid url') {
    return this.regex(urlRegex, message);
  }

  public email(message = 'Input is not a valid email') {
    return this.regex(emailRegex, message);
  }

  public min(length: number, message = 'Input is too short') {
    const rule: Rule<string> = entry => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry.length <= length) {
        return message;
      }
    };

    this.validationRules.push(rule);

    return this;
  }

  public max(length: number, message = 'Input is too long') {
    const rule: Rule<string> = entry => {
      if (entry === undefined || entry === null) {
        return;
      }

      if (entry.length >= length) {
        return message;
      }
    };

    this.validationRules.push(rule);

    return this;
  }
}

export default NopeString;
