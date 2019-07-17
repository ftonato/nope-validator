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
