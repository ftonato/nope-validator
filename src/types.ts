// shared types
import { NopePrimitive } from './NopePrimitive';

type RuleResult<T> = string | undefined | NopePrimitive<T>;

export type AnyObject = Record<string | number, any>;

export type Context = Record<string | number, any>;

export type Rule<T> = (entry?: T | null, context?: Context) => RuleResult<T>;

export type AsyncRule<T> = (entry?: T | null, context?: Context) => Promise<RuleResult<T>>;

export interface Validatable<T> {
  validate: Rule<T>;
  validateAsync: AsyncRule<T>;
  getType: () => string;
}

export interface ShapeErrors {
  [key: string]: string | ShapeErrors;
}

export type Nil = null | undefined;
