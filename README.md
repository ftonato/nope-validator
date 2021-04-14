# Nope 🙅

[![CircleCI](https://circleci.com/gh/bvego/nope-validator.svg?style=svg)](https://circleci.com/gh/bvego/nope-validator)
[![Fast](https://badgen.now.sh/badge/speed/really%20fast/green)](https://npm.im/nope-validator)
[![Version](https://img.shields.io/npm/v/nope-validator.svg)](https://npm.im/nope-validator)
[![size](https://img.shields.io/bundlephobia/min/nope-validator.svg)](https://bundlephobia.com/result?p=nope-validator)
[![gzip](https://img.shields.io/bundlephobia/minzip/nope-validator.svg)](https://bundlephobia.com/result?p=nope-validator)

A small, simple and fast JS validator. Like, wow thats fast. 🚀

Nope's API is ~~heavily inspired~~ stolen from [Yup](https://github.com/jquense/yup) but Nope attempts to be much smaller and much faster. To achieve this Nope only allows for synchronous data validation which should cover most of the use cases.

### Note: Nope is not a plug-and-play replacement for Yup, in some cases at least.

Instead of throwing errors Nope simply returns the error object and if there are no errors it returns undefined.

Typescript definitions included. ✨

- [Usage](#usage)
- [API](#api)
- [Usage with Formik](#usage-with-formik)

## Usage

To start using Nope simply do

```sh
yarn add nope-validator
```

or

```sh
npm install -S nope-validator
```

```js
// const Nope = require('nope-validator'); // or
// const { Nope } = require('nope-validator'); // or
import Nope from 'nope-validator';
```

```js
// create a schema

const UserSchema = Nope.object().shape({
  name: Nope.string()
    .atLeast(5, 'Please provide a longer name')
    .atMost(255, 'Name is too long!'),
  email: Nope.string()
    .email()
    .required(),
  confirmEmail: Nope.string()
    .oneOf([Nope.ref('email')])
    .requried(),
});

UserSchema.validate({
  name: 'John',
  email: 'me@gmail.com',
  confirmEmail: 'me@gmail.com',
}); // returns an error object { name: 'Please provide a longer name '};
UserSchema.validate({
  name: 'Jonathan Livingston',
  email: 'me@gmail.com',
  confirmEmail: 'me@gmail.com',
}); // returns undefined since there are no errors
```

## API

- `Primitives` (String, Number, Date, Boolean)

  - `when(key: string | string[], conditionObject: { is: boolean | ((...args: any) => boolean), then: NopeSchema, othervise: NopeSchema })` - Conditional validation of a key.
  - The first param is the set of keys (or a single key) that the `is` predicate should run on. Note that you can access the parent object(s) by using the ../ syntax as shown in the 2nd example

  - The `is` param can be set to simply true or false (which will run the .every method on the values and assert the against the passed `is`) or a predicate that will decide what schema will be active in that moment.

  - ```js
    const schema = Nope.object().shape({
      check: Nope.boolean().required(),
      test: Nope.string().when('check', {
        is: true,
        then: Nope.string()
          .atLeast(5, 'minError')
          .required(),
        otherwise: Nope.string()
          .atMost(5)
          .required(),
      }),
    });

    schema.validate({
      check: true,
      test: 'test',
    }); // { test: 'minError' }
    // or as a predicate
    const schema2 = Nope.object().shape({
      check: Nope.boolean(),
      check2: Nope.boolean(),
      test: Nope.string().when(['check', 'check2'], {
        is: (check, check2) => check && check2,
        then: Nope.string()
          .atLeast(5, 'minError')
          .required(),
        otherwise: Nope.string()
          .atMost(5)
          .required(),
      }),
    });
    schema.validate({
      check: true,
      check2: false,
      test: 'testing',
    }); // { test: 'maxError' }
    ```
  - ```js
    const schema = Nope.object().shape({
      shouldCreateUser: Nope.boolean().required('reqbool'),
      user: Nope.object().shape({
        name: Nope.string().when('../shouldCreateUser', {
          is: (str) => !!str,
          then: Nope.string().required('required'),
          otherwise: Nope.string().notAllowed('not allowed'),
        }),
      }),
    });

    const validInput1 = {
      shouldCreateUser: true,
      user: {
        name: 'user name',
      },
    };
    const invalidInput1 = {
      shouldCreateUser: true,
      user: {
        name: undefined,
      },
    };

    expect(schema.validate(validInput1)).toEqual(undefined);
    expect(schema.validate(invalidInput1)).toEqual({
      user: {
        name: 'required',
      },
    });
    ```

  - `oneOf(options: string | ref[], message: string)` - Asserts if the entry is one of the defined options
  - ```js
    Nope.string()
      .oneOf(['a', 'b', 'c'])
      .validate('b'); // returns undefined

    Nope.string()
      .oneOf(['a', 'b', 'c'])
      .validate('d'); // returns the error message
    ```

  - `notOneOf(options: number | ref[], message: string)` - Asserts if the entry is one of the defined options
  - ```js
    Nope.string()
      .notOneOf([1, 2, 3])
      .validate(5); // returns undefined

    Nope.string()
      .notOneOf([1, 2, 3])
      .validate(2); // returns the error message
    ```

  - `required(message: string)` - Asserts if the entry is not nil
  - ```js
    Nope.string()
      .required()
      .validate('b'); // returns undefined

    Nope.string()
      .required()
      .validate(); // returns the error message
    ```

  - `notAllowed(message: string)` - Asserts if the entry is nil
  - ```
    Nope.string()
      .notAllowed()
      .validate(null); // returns undefined

    Nope.string()
      .notAllowed()
      .validate('42'); // returns the error message
    ```

  - `test(rule: (entry: string) => string | undefined)` - Add a custom rule
  - ```js
    Nope.string()
      .test(a => (a === '42' ? undefined : 'Must be 42'))
      .validate('42'); // returns undefined

    Nope.string()
      .test(a => (a === '42' ? undefined : 'Must be 42'))
      .validate('41'); // returns the error message
    ```

  - `validate(entry: string | undefined | null)` - Runs the rule chain against an entry


- `Object`
  - `shape(shape: object)` - Sets the shape which of the object. Use name as keys and Nope validators as values
  - ```js
    const schema = Nope.object().shape({
      name: Nope.string()
        .atMost(15)
        .required(),
      email: Nope.string()
        .email('Please provide a valid email')
        .required(),
    });

    const errors = schema.validate({
      name: 'Test',
      email: 'invalidemail',
    });

    console.log(errors); // { email: 'Please provide a valid email', }
    ```
  - `extend(Base: NopeObject)` - Extends the schema of an already defined NopeObject
  - ```js
    const baseSchema = Nope.object().shape({
      password: Nope.string().atLeast(5),
      confirmPassword: Nope.string()
        .oneOf([Nope.ref('password')], "Passwords don't match")
        .required(),
    });

    const userSchema = Nope.object()
      .extend(baseSchema)
      .shape({
        name: Nope.string()
          .atLeast(4)
          .required(),
      });

    userSchema.validate({
      name: 'Jonathan',
      password: 'birdybird',
      confirmPassworod: 'burdyburd',
    }); // returns { confirmPassword: 'Passwords don\'t match' }
    ```

- `String`

  - `regex(regex: RegExp, message: string)` - Asserts if the entry matches the pattern
  - ```js
    Nope.string()
      .regex(/abc/i)
      .validate('abc'); // returns undefined

    Nope.string()
      .regex(/abc/i)
      .validate('123'); // returns the error message
    ```

  - `url(message: string)` - Asserts if the entry is a valid URL
  - ```js
    Nope.string()
      .url()
      .validate('http://google.com'); // returns undefined

    Nope.string()
      .url()
      .validate('http:google.com'); // returns the error message
    ```

  - `email(message: string)` - Asserts if the entry is a valid email
  - ```js
    Nope.string()
      .email()
      .validate('test@gmail.com'); // returns undefined

    Nope.string()
      .email()
      .validate('testgmail.com'); // returns the error message
    ```

  - `min(length: number, message: string)` - **_deprecated_**: alias for greaterThan

  - `max(length: number, message: string)` - **_deprecated_**: alias for lessThan

  - `greaterThan(length: number, message: string)` - Asserts if the entry is smaller than a threshold
  - ```js
    Nope.string()
      .greaterThan(4)
      .validate('https'); // returns undefined

    Nope.string()
      .greaterThan(4)
      .validate('http'); // returns the error message
    ```

  - `lessThan(length: number, message: string)` - Asserts if the entry is greater than a threshold
  - ```js
    Nope.string()
      .lessThan(4)
      .validate('url'); // returns undefined

    Nope.string()
      .lessThan(4)
      .validate('http'); // returns the error message

  - `exactLength(length: number, message: string)` - Asserts if the entry is of exact length
  - ```js
    Nope.string()
      .exactLength(4)
      .validate('test'); // returns undefined

    Nope.string()
      .exactLength(4)
      .validate('testing'); // returns the error message
    ```

- `Number`

  - `integer(message: string)` - Asserts if the entry is an integer
  - ```js
    Nope.number()
      .integer('error message')
      .validate(2); // returns undefined

    Nope.number()
      .integer('error message')
      .validate(4.2); // returns the error message
    ```

  - `min(size: number, message: string)` - **_deprecated_**: alias for greaterThan

  - `max(size: number, message: string)` - **_deprecated_**: alias for lessThan

  - `greaterThan(size: number, message: string)` - Asserts if the entry is smaller than a threshold
  - ```js
    Nope.number()
      .greaterThan(1, 'error message')
      .validate(2); // returns undefined

    Nope.number()
      .greaterThan(1, 'error message')
      .validate(1); // returns the error message
    ```

  - `lessThan(size: number, message: string)` - Asserts if the entry is greater than a threshold
  - ```js
    Nope.number()
      .lessThan(1, 'error message')
      .validate(-1); // returns undefined

    Nope.number()
      .lessThan(1, 'error message')
      .validate(2); // returns the error message
    ```

  - `positive(message: string)` - Asserts if the entry is positive
  - ```js
    Nope.number()
      .positive('error message')
      .validate(42); // returns undefined

    Nope.number()
      .positive('error message')
      .validate(-42); // returns the error message
    ```

  - `negative(message: string)` - Asserts if the entry is negative
  - ```js
    Nope.number()
      .negative('error message')
      .validate(-42); // returns undefined

    Nope.number()
      .negative('error message')
      .validate(42); // returns the error message
    ```

- `Date`

  - `before(date: string | number | Date, message: string)` - Asserts if the entry is before a certain date
  - ```js
    Nope.date()
      .before('2019-01-01')
      .validate('2018-31-12'); // returns undefined

    Nope.date()
      .before('2019-01-01')
      .validate('2019-01-02'); // returns the error message
    ```

  - `after(date: string | number | Date, message: string)` - Asserts if the entry is after a certain date
  - ```js
    Nope.date()
      .after('2019-01-01')
      .validate('2018-02-01'); // returns undefined

    Nope.date()
      .after('2019-01-01')
      .validate('2018-31-12'); // returns the error message
    ```

- `Boolean`

  - `true(message: string)` - Asserts if the entry is true
  - ```js
    Nope.boolean()
      .true()
      .validate(true); // returns undefined

    Nope.boolean()
      .true()
      .validate(false); // returns the error message
    ```

  - `false(message: string)` - Asserts if the entry is false
  - ```js
    Nope.boolean()
      .false()
      .validate(false); // returns undefined

    Nope.boolean()
      .false()
      .validate(true); // returns the error message
    ```
  
  - `noUnknown(message: string)` - Return an error message if the entry contains keys that are not defined in the schema

  - ```js
    const schema = Nope.object().shape({
      name: Nope.string().atLeast(5),
    }).noUnknown('no unknown keys');

    schema.validate({
      name: 'Jonathan',
      password: 'birdybird',
    }); // returns 'no unknown keys';
    ```

  - `validate(entry: object)` - Runs the rule chain against an entry
  - `validateAt(path: string, entry: Record<string | number, any>)`
  - ```js
    const schema = Nope.object().shape({
        foo: Nope.array().of(
          Nope.object().shape({
            loose: Nope.boolean(),
            bar: Nope.string().when('loose', {
              is: true,
              then: Nope.string().max(5, 'tooLong'),
              otherwise: Nope.string().min(5, 'tooShort'),
            }),
          }),
        ),
      });

      const rootValue = {
        foo: [{ bar: '123' }, { bar: '123456', loose: true }],
      };

      schema.validateAt('foo[0].bar', rootValue); // returns 'tooShort';
      schema.validateAt('foo[1].bar', rootValue); // returns 'tooLong';
    ```

- `Array`
  - `required(message: string)` - Required field (non falsy)
  - `of(primitive: Validatable<T>)` - Required the field to be of a certain schema
  - ```js
    const schema = Nope.object().shape({
      names: Nope.array()
        .of(Nope.string().min(5))
        .required(),
    });

    schema.validate({
      names: ['Geralt']
    }); // returns undefined;
    ```
  - `minLength(length: number, message?: string)` - Minimal length of the field
  - `maxLength(length: number, message?: string)` - Max length of the field
  - `mustContain(value: T, message?: string)` - Must contain a certain item
  - `hasOnly(values: T[], message?: string)` - Must only contain certain items
  - `every(predicate: item => boolean, message?: string)` - Every item passes predicate. Alike `Array.prototype.every`
  - `some(predicate: item => boolean, message?: string)` - Some items pass the predicate. Alike `Array.prorotype.some`

- `Reference` - allows the schema to reference other values in the provided entry

  - ```js
    const schema = Nope.object().shape({
      email: Nope.string()
        .email()
        .atMost(255)
        .required(),
      confirmEmail: Nope.string().oneOf([Nope.ref('email')], 'Must match the first email'),
    });

    const errors = schema.validate({
      email: 'me@gmail.com',
      confirmEmail: 'you@gmail.com',
    });
    console.log(errors); // { confirmEmail: 'Must match the first email' }

    const noerrors = schema.validate({
      email: 'me@gmail.com',
      confirmEmail: 'me@gmail.com',
    });

    console.log(noerrors); // undefined
    ```
  - ```js
      const schema = Nope.object().shape({
        validUsernames: Nope.array().of(Nope.string()),
        user: Nope.object().shape({
          name: Nope.string().oneOf(Nope.ref('../validUsernames'), 'not valid'),
        }),
      });

      const invalidInput = {
        validUsernames: ['megatron'],
        user: {
          name: 'ultron',
        },
      };

      expect(schema.validate(invalidInput1)).toEqual({
        user: {
          name: 'not valid',
        },
      });
    ```

## Usage with [Formik](https://github.com/jaredpalmer/formik)

Instead of passing it through the `validationSchema` prop, you should call Nope's validate on the `validate` prop as shown in the example below.

```jsx
const schema = Nope.object().shape({
  email: Nope.string()
    .email()
    .atMost(255)
    .required(),
  password: Nope.string()
    .atLeast(8)
    .atMost(64)
    .required(),
});

<Formik
  initialValues={{ email: '', password: '' }}
  validate={values => schema.validate(values)}
  onSubmit={values => console.log('Submitted', values)}
>
  {() => (
    <Form>
      <Field type="email" name="email" />
      <ErrorMessage name="email" component="div" />
      <Field type="password" name="password" />
      <ErrorMessage name="password" component="div" />
      <button type="submit">Submit</button>
    </Form>
  )}
</Formik>;
```
