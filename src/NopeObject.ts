import { Validatable, Rule, ShapeErrors } from './types';

interface ObjectShape {
  [key: string]: Validatable<any>;
}

class NopeObject {
  private objectShape: ObjectShape;
  private validationRules: Rule<object>[] = [];

  public constructor(objectShape?: ObjectShape) {
    this.objectShape = objectShape || {};
  }

  public shape(shape: ObjectShape) {
    this.objectShape = { ...this.objectShape, ...shape };

    return this;
  }

  public extend(Base: NopeObject) {
    this.objectShape = { ...this.objectShape, ...Base.objectShape };

    return this;
  }

  public noUnknown(message = 'Input contains invalid keys') {
    const rule: Rule<object> = (entry) => {
      let objectIsDefined = false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _ in this.objectShape) {
        objectIsDefined = true;
        break;
      }

      if (!objectIsDefined) {
        throw Error('noUnknown must be used with a schema');
      }

      let unknownKeys = false;

      for (const key in entry) {
        unknownKeys = unknownKeys || !(key in this.objectShape);
      }

      if (unknownKeys) {
        return message;
      }
    };

    this.validationRules.push(rule);

    return this;
  }

  public validate(entry: { [key: string]: any }) {
    for (const rule of this.validationRules) {
      const localErrors = rule(entry);

      if (localErrors) {
        return localErrors;
      }
    }

    const errors: ShapeErrors = {};
    let areErrors = false;

    for (const key in this.objectShape) {
      const rule = this.objectShape[key];

      const error = rule.validate(entry[key], entry);

      if (error && typeof error === 'string') {
        areErrors = true;
        errors[key] = error;
      }
    }

    if (areErrors) {
      return errors;
    }

    return undefined;
  }
}

export default NopeObject;
