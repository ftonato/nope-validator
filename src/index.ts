import NopeObject from './NopeObject';
import NopeString from './NopeString';
import NopeNumber from './NopeNumber';
import NopeBoolean from './NopeBoolean';
import NopeArray from './NopeArray';
import NopeDate from './NopeDate';
import NopeReference from './NopeReference';

const NopeObjectConstructor = () => new NopeObject();
const NopeStringConstructor = () => new NopeString();
const NopeNumberConstructor = () => new NopeNumber();
const NopeBooleanConstructor = () => new NopeBoolean();
const NopeArrayConstructor = <T>() => new NopeArray<T>();
const NopeDateConstructor = () => new NopeDate();
const NopeReferenceConstructor = (key: string) => new NopeReference(key);

const Nope = {
  object: NopeObjectConstructor,
  string: NopeStringConstructor,
  number: NopeNumberConstructor,
  boolean: NopeBooleanConstructor,
  array: NopeArrayConstructor,
  date: NopeDateConstructor,
  ref: NopeReferenceConstructor,
};

export {
  Nope,
  NopeObjectConstructor as object,
  NopeNumberConstructor as number,
  NopeStringConstructor as string,
  NopeBooleanConstructor as boolean,
  NopeArrayConstructor as array,
  NopeDateConstructor as date,
  NopeReferenceConstructor as ref,
};

export default Nope;
