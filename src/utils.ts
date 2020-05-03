import { Nil } from './types';
import NopeReference from './NopeReference';

export function resolveNopeRefsFromKeys(
  options: (string | Nil)[],
  context?: { [key: string]: any },
) {
  const resolvedOptions = options.map(option => {
    if (context && option !== undefined && option !== null) {
      return context[option];
    }

    return option;
  });

  return resolvedOptions;
}

export function every(arr: any[], predicate: (value: any) => boolean) {
  return arr.filter(value => !predicate(value)).length === 0;
}

export function resolveNopeRef<T>(
  option: T | NopeReference | Nil,
  context?: { [key: string]: any },
) {
  if (option instanceof NopeReference && context) {
    return context[option.key];
  }

  return option;
}

export function deepEquals(a: any, b: any): boolean {
  if (typeof a == 'object' && a != null && (typeof b == 'object' && b != null)) {
    if (a === b) {
      return true;
    }

    let aCount = 0;
    let bCount = 0;

    for (const _ in a) {
      aCount++;
    }
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
