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

export class NopeObject {
  private objectShape: ObjectShape;
  private validationRules: (Rule<AnyObject> | AsyncRule<AnyObject>)[] = [];
  protected _type = 'object';
  private _stripUnknown = false;

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

  public pick(keys: string[]): NopeObject {
    const newShape: ObjectShape = {};

    for (const key of keys) {
      if (key in this.objectShape) {
        newShape[key] = this.objectShape[key];
      }
    }

    const newObj = new NopeObject(newShape);
    newObj._stripUnknown = this._stripUnknown;
    return newObj;
  }

  public omit(keys: string[]): NopeObject {
    const newShape: ObjectShape = {};

    for (const key in this.objectShape) {
      if (keys.indexOf(key) === -1) {
        newShape[key] = this.objectShape[key];
      }
    }

    const newObj = new NopeObject(newShape);
    newObj._stripUnknown = this._stripUnknown;
    return newObj;
  }

  public stripUnknown() {
    this._stripUnknown = true;
    return this;
  }

  public getDefault(): AnyObject | undefined {
    const defaults: AnyObject = {};
    let hasAny = false;

    for (const key in this.objectShape) {
      const validator = this.objectShape[key];
      if (validator && typeof (validator as any).getDefault === 'function') {
        const def = (validator as any).getDefault();
        if (def !== undefined) {
          defaults[key] = def;
          hasAny = true;
        }
      }
    }

    return hasAny ? defaults : undefined;
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

  private _strip(entry: AnyObject): AnyObject {
    const result: AnyObject = {};

    for (const key in this.objectShape) {
      if (key in entry) {
        const validator = this.objectShape[key];
        if (validator instanceof NopeObject && (validator as any)._stripUnknown) {
          result[key] = validator._strip(entry[key]);
        } else {
          result[key] = entry[key];
        }
      }
    }

    return result;
  }

  public isValid(entry: AnyObject, context?: Context): Promise<boolean> {
    return this.validateAsync(entry, context).then((error: any) => !error);
  }

  public isValidSync(
    entry: AnyObject,
    context?: AnyObject | null,
    options?: ValidateOptions,
  ): boolean {
    return !this.validate(entry, context, options);
  }

  public validate(entry: AnyObject, context?: AnyObject | null, options?: ValidateOptions) {
    const input = this._stripUnknown ? this._strip(entry) : entry;

    for (const rule of this.validationRules) {
      const localErrors = rule(input);

      if (localErrors) {
        return localErrors;
      }
    }

    let areErrors = false;
    const abortEarly = options?.abortEarly;
    const errors: ErrorsResult = {};

    const ctx = Object.assign({ ___parent: context }, input);

    for (const key in this.objectShape) {
      const validator = this.objectShape[key];
      const error = validator.validate(input[key], ctx, options);

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

    if (this._stripUnknown) {
      return undefined;
    }

    return undefined;
  }

  public validateAsync(
    entry: AnyObject,
    context?: Context,
    options?: Omit<ValidateOptions, 'abortEarly'>,
  ) {
    const input = this._stripUnknown ? this._strip(entry) : entry;

    return runValidators(this.validationRules, input, context).then((localError: any) => {
      if (localError) {
        return localError;
      }

      const keys: string[] = [];
      const results: any[] = [];

      const ctx = Object.assign({ ___parent: context }, input);

      for (const key in this.objectShape) {
        const validator = this.objectShape[key];
        const error = validator.validateAsync(input[key], ctx, options);

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
