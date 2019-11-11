// shared types
import NopePrimitive from './NopePrimitive';

export type Rule<T> = (
  entry: T | Nil,
  context?: {
    [key: string]: any;
  },
) => string | undefined | NopePrimitive<T>;

export interface Validatable<T> {
  validate: Rule<T> | Rule<T[]>;
}

export interface ShapeErrors {
  [key: string]: string;
}

export type Nil = null | undefined;

export type Type =
  | 'undefined'
  | 'object'
  | 'boolean'
  | 'number'
  | 'bigInt'
  | 'string'
  | 'symbol'
  | 'function';
