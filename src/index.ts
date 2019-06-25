import NopeObject from './NopeObject';
import NopeString from './NopeString';
import NopeNumber from './NopeNumber';
import NopeBoolean from './NopeBoolean';
import NopeDate from './NopeDate';
import NopeReference from './NopeReference';

const NopeObjectConstructor = () => new NopeObject();
const NopeStringConstructor = () => new NopeString();
const NopeNumberConstructor = () => new NopeNumber();
const NopeBooleanConstructor = () => new NopeBoolean();
const NopeDateConstructor = () => new NopeDate();
const NopeReferenceConstructor = (key: string) => new NopeReference(key);

const Nope = {
  object: NopeObjectConstructor,
  string: NopeStringConstructor,
  number: NopeNumberConstructor,
  boolean: NopeBooleanConstructor,
  date: NopeDateConstructor,
  ref: NopeReferenceConstructor,
};

export {
  Nope,
  NopeObjectConstructor as object,
  NopeNumberConstructor as number,
  NopeStringConstructor as string,
  NopeBooleanConstructor as boolean,
  NopeDateConstructor as date,
  NopeReferenceConstructor as ref,
};

export default Nope;
