import { Validatable, Rule, AsyncRule, ShapeErrors, Context } from './types';
import { pathToArray, getFromPath, runValidators } from './utils';

interface ObjectShape {
  [key: string]: Validatable<any> | NopeObject;
}

type ValidateOptions = {
  abortEarly: boolean;
};

type AnyObject = Record<string | number, any>;

type ErrorsResult = ShapeErrors | undefined;

class NopeObject {
  private objectShape: ObjectShape;
  private validationRules: (Rule<AnyObject> | AsyncRule<AnyObject>)[] = [];
  protected _type = 'object';

  public constructor(objectShape?: ObjectShape) {
    this.objectShape = objectShape || {};
  }

  public getType() {
    return this._type;
  }

  public shape(shape: ObjectShape) {
    Object.assign(this.objectShape, shape);

    return this;
  }

  public extend(Base: NopeObject) {
    Object.assign(this.objectShape, Base.objectShape);

    return this;
  }

  public noUnknown(message = 'Input contains invalid keys') {
    const rule: Rule<Record<string | number, unknown>> = (entry) => {
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

  public validate(entry: AnyObject, context?: AnyObject | null, options?: ValidateOptions) {
    for (const rule of this.validationRules) {
      const localErrors = rule(entry);

      if (localErrors) {
        return localErrors;
      }
    }

    let areErrors = false;
    const abortEarly = options?.abortEarly;
    const errors: ErrorsResult = {};

    const ctx = Object.assign({ ___parent: context }, entry);

    for (const key in this.objectShape) {
      const validator = this.objectShape[key];
      const error = validator.validate(entry[key], ctx, options);

      if (error) {
        areErrors = true;
        errors[key] = error as string;

        if (abortEarly) {
          return errors;
        }
      }
    }

    if (areErrors) {
      return errors;
    }

    return undefined;
  }

  public validateAsync(
    entry: AnyObject,
    context?: Context,
    options?: Omit<ValidateOptions, 'abortEarly'>,
  ) {
    return runValidators(this.validationRules, entry, context).then((localError: any) => {
      if (localError) {
        return localError;
      }

      const keys: string[] = [];
      const results: any[] = [];

      const ctx = Object.assign({ ___parent: context }, entry);

      for (const key in this.objectShape) {
        const validator = this.objectShape[key];
        const error = validator.validateAsync(entry[key], ctx, options);

        keys.push(key);
        results.push(error);
      }

      return Promise.all(results).then((resolvedErrors) => {
        const errors: ErrorsResult = {};
        let areErrors = false;
        for (let i = 0; i < keys.length; i++) {
          const error = resolvedErrors[i];

          if (error) {
            areErrors = true;
            errors[keys[i]] = error as string;
          }
        }

        if (areErrors) {
          return errors;
        }

        return undefined;
      });
    });
  }

  public validateAt(path: string, entry: Record<string | number, any>) {
    const arrayPath = pathToArray(path);

    let validator: any = this.objectShape;

    for (const p of arrayPath) {
      if (!isNaN(parseInt(p, 10))) {
        continue;
      }

      if (validator[p]?.objectShape) {
        validator = validator[p].objectShape;
      } else if (validator[p]?.ofShape) {
        validator = validator[p].ofShape.objectShape || validator[p].ofShape;
      } else {
        validator = validator[p];
      }
    }

    const parentValue = getFromPath(path, entry, true);
    const value = getFromPath(path, entry);

    return validator.validate(value, parentValue);
  }
}

export default NopeObject;
