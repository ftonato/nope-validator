import { Nil } from './types';
import NopeReference from './NopeReference';

function resolvePathFromContext(path: string, context?: Record<string | number, any>) {
  const optionWithPath = path.split('../');
  const depth = optionWithPath.length - 1;

  const key = optionWithPath[optionWithPath.length - 1];

  let ctx = context;

  for (let i = 0; i < depth; i++) {
    ctx = ctx?.___parent;
  }

  if (ctx && key !== undefined && key !== null) {
    return ctx[key];
  }

  return key;
}

export function resolveNopeRefsFromKeys(options: string[], context?: Record<string | number, any>) {
  const resolvedOptions = options.map((option) => {
    return resolvePathFromContext(option, context);
  });

  return resolvedOptions;
}

export function every(arr: any[], predicate: (value: any) => boolean) {
  return arr.filter((value) => !predicate(value)).length === 0;
}

export function resolveNopeRef<T>(
  option: T | NopeReference | Nil,
  context?: Record<string | number, any>,
) {
  if (option instanceof NopeReference) {
    return resolvePathFromContext(option.key, context);
  }

  return option;
}

export function deepEquals(a: any, b: any): boolean {
  if (typeof a == 'object' && a != null && typeof b == 'object' && b != null) {
    if (a === b) {
      return true;
    }

    let aCount = 0;
    let bCount = 0;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ in a) {
      aCount++;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ in b) {
      bCount++;
    }

    if (aCount - bCount !== 0) {
      return false;
    }

    for (const key in a) {
      if (!(key in b) || !deepEquals(a[key], b[key])) {
        return false;
      }
    }
    for (const key in b) {
      if (!(key in a) || !deepEquals(b[key], a[key])) {
        return false;
      }
    }
    return true;
  }

  return a === b;
}

export function pathToArray(path: string): string[] {
  return path.split(/[,[\].]/g).filter(Boolean);
}

export function getFromPath(path: string, entry: Record<string | number, any>, dropLast = false) {
  if (!path) {
    return undefined;
  }

  let pathArray = pathToArray(path);
  pathArray = dropLast ? pathArray.slice(0, -1) : pathArray;

  let value: any = entry;

  for (const key of pathArray) {
    value = value[key];
  }

  return value;
}

export function runValidators(tasks: any, entry: any, context: any) {
  let done = false;
  return tasks.reduce(function (previous: any, next: any) {
    if (done) {
      return previous;
    }
    return previous.then(function (error: any) {
      if (error) {
        done = true;
        return error;
      }

      return next(entry, context);
    });
  }, Promise.resolve());
}
