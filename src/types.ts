// shared types
import NopePrimitive from './NopePrimitive';

export type Rule<T> = (
  entry: T | Nil,
  context?: {
    [key: string]: any;
  },
) => string | undefined | NopePrimitive<T>;

export interface IValidatable<T> {
  validate: Rule<T>;
}

export interface ShapeErrors {
  [key: string]: string;
}

export type Nil = null | undefined;
