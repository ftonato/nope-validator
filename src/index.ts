import NopeObject from './NopeObject';
import NopeString from './NopeString';
import NopeNumber from './NopeNumber';
import NopeBoolean from './NopeBoolean';
import NopeArray from './NopeArray';
import NopeDate from './NopeDate';
import NopeReference from './NopeReference';

const object = () => new NopeObject();
const string = () => new NopeString();
const number = (message?: string) => new NopeNumber(message);
const boolean = () => new NopeBoolean();
const date = (message?: string) => new NopeDate(message);
const array = <T>() => new NopeArray<T>();
const ref = (key: string) => new NopeReference(key);

const Nope = {
  object,
  string,
  number,
  boolean,
  date,
  array,
  ref,
};

export { Nope, object, string, number, boolean, date, array, ref };

export default Nope;
