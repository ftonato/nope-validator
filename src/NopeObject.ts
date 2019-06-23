import { IValidatable, ShapeErrors } from './types';

interface ObjectShape {
  [key: string]: IValidatable<any>;
}

class NopeObject {
  private objectShape: ObjectShape | null = null;

  constructor(objectShape?: ObjectShape) {
    this.objectShape = objectShape || null;
  }

  public shape(shape: ObjectShape) {
    this.objectShape = shape;

    return this;
  }

  public validate(entry: { [key: string]: any }) {
    const errors: ShapeErrors = {};
    let areErrors = false;

    for (const key in this.objectShape) {
      if (this.objectShape) {
        const rule = this.objectShape[key];

        const error = rule.validate(entry[key], entry);

        if (error) {
          areErrors = true;
          errors[key] = error;
        }
      }
    }

    if (areErrors) {
      return errors;
    }

    return undefined;
  }
}

export default NopeObject;
