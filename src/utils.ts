import { Nil } from './types';

export function resolveNopeRefsFromKeys(
  options: Array<string | Nil>,
  context?: { [key: string]: any },
) {
  const resolvedOptions = options.map(option => {
    if (context && option !== undefined && option !== null && context[option] !== undefined) {
      return context[option];
    }

    return option;
  });

  return resolvedOptions;
}

export function every(arr: any[], predicate: (value: any) => boolean) {
  return arr.filter(value => !predicate(value)).length === 0;
}
