// shared types

export type Rule<T> = (
  entry: T | Nil,
  context?: {
    [key: string]: any;
  },
) => string | undefined;

export interface IValidatable<T> {
  validate: Rule<T>;
}

export interface ShapeErrors {
  [key: string]: string;
}

export type Nil = null | undefined;
