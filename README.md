# Nope 🙅

[![Fast](https://badgen.now.sh/badge/speed/really%20fast/green)](https://npm.im/nope-validator)
[![Version](https://img.shields.io/npm/v/nope-validator.svg)](https://npm.im/nope-validator)
[![size](https://img.shields.io/bundlephobia/min/nope-validator/0.2.0.svg)](https://npm.im/nope-validator)
[![gzip](https://img.shields.io/bundlephobia/minzip/nope-validator/0.2.0.svg)](https://npm.im/nope-validator)

A small, simple and fast JS validator. Like, wow thats fast. 🚀

Nope is heavily inspired by [Yup](https://github.com/jquense/yup) but attempts to be smaller and faster. To achieve this Nope only allows for synchronous data validation which should cover most of the use cases.

Note that instead of throwing errors Nope simply returns the error object and if there are no errors it returns undefined.

Typescript definitions included. 🚀

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
    .min(5, 'Please provide a longer name')
    .max(255, 'Name is too long!'),
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

- `String`

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

  - `min(length: number, message: string)` - Asserts if the entry is smaller than a threshold
  - ```js
    Nope.string()
      .min(4)
      .validate('https'); // returns undefined

    Nope.string()
      .min(4)
      .validate('http'); // returns the error message
    ```

  - `max(length: number, message: string)` - Asserts if the entry is greater than a threshold
  - ```js
    Nope.string()
      .max(4)
      .validate('url'); // returns undefined

    Nope.string()
      .max(4)
      .validate('http'); // returns the error message
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

  - `required(message: string)` - Asserts if the entry is not nil
  - ```js
    Nope.string()
      .required()
      .validate('b'); // returns undefined

    Nope.string()
      .required()
      .validate(); // returns the error message
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

- `Number`

  - `min(size: number, message: string)` - Asserts if the entry is smaller than a threshold
  - ```js
    Nope.number()
      .min(1, 'error message')
      .validate(2); // returns undefined

    Nope.number()
      .min(1, 'error message')
      .validate(1); // returns the error message
    ```

  - `max(size: number, message: string)` - Asserts if the entry is greater than a threshold
  - ```js
    Nope.number()
      .max(1, 'error message')
      .validate(-1); // returns undefined

    Nope.number()
      .max(1, 'error message')
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

  - `oneOf(options: string | ref[], message: string)` - Asserts if the entry is one of the defined options
  - ```js
    Nope.number()
      .oneOf([1, 2, 3])
      .validate(2); // returns undefined

    Nope.number()
      .oneOf([1, 2, 3])
      .validate(4); // returns the error message
    ```

  - `required(message: string)` - Asserts if the entry is not nil
  - ```js
    Nope.number()
      .required()
      .validate(2); // returns undefined

    Nope.number()
      .required()
      .validate(); // returns the error message
    ```

  - `test(rule: (entry: number) => string | undefined)` - Add a custom rule
  - ```js
    Nope.number()
      .test(a => (a === 42 ? undefined : 'Must be 42'))
      .validate(42); // returns undefined

    Nope.number()
      .test(a => (a === 42 ? undefined : 'Must be 42'))
      .validate(41); // returns the error message
    ```

  - `validate(entry: number | undefined | null)` - Runs the rule chain against an entry

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

  - `oneOf(options: string | ref[], message: string)` - Asserts if the entry is one of the defined options
  - ```js
    Nope.date()
      .oneOf(['2019-01-01', '2019-01-02'])
      .validate('2018-01-02'); // returns undefined

    Nope.date()
      .oneOf(['2019-01-01', '2019-01-02'])
      .validate('2018-31-12'); // returns the error message
    ```

  - `required(message: string)` - Asserts if the entry is not nil
  - ```js
    Nope.date()
      .required()
      .validate('2019-01-01'); // returns undefined

    Nope.date()
      .required()
      .validate(); // returns the error message
    ```

  - `test(rule: (entry: string | number | Date) => string | undefined` - Add a custom rule
  - ```js
    Nope.date()
      .test(d => (d !== new Date('2019-01-01') ? undefined : "Can't be 2019-01-01"))
      .validate(new Date('2019-01-02')); // returns undefined

    Nope.date()
      .test(d => (d !== new Date('2019-01-01') ? undefined : "Can't be 2019-01-01"))
      .validate(new Date('2019-01-01')); // returns the error message
    ```

  - `validate(entry: string | number | Date | undefined | null)` - Runs the rule chain against an entry

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

  - `oneOf(options: boolean | ref[], message: string)` - Asserts if the entry is one of the defined options
  - ```js
    Nope.boolean()
      .oneOf([true])
      .validate(true); // returns undefined

    Nope.boolean()
      .oneOf([true])
      .validate(false); // returns the error message
    ```

  - `required(message: string)` - Asserts if the entry is not nil
  - ```js
    Nope.boolean()
      .required()
      .validate(true); // returns undefined

    Nope.boolean()
      .required()
      .validate(); // returns the error message
    ```

  - `test(rule: (entry: boolean) => string | undefined)` - Add a custom rule
  - ```js
    Nope.boolean()
      .test(a => (a === true ? undefined : 'Must be true'))
      .validate(true); // returns undefined

    Nope.boolean()
      .test(a => (a === true ? undefined : 'Must be true'))
      .validate(false); // returns the error message
    ```

  - `validate(entry: boolean | undefined | null)` - Runs the rule chain against an entry

- `Object`

  - `shape(shape: object)` - Sets the shape which of the object. Use name as keys and Nope validators as values
  - ```js
    const schema = Nope.object().shape({
      name: Nope.string()
        .max(15)
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
      password: Nope.string()
        .min(5),
      confirmPassword: Nope.string()
        .oneOf([Nope.ref('password')], 'Passwords don\'t match')
        .required(),
    });

    const userSchema = Nope.object()
      .extend(baseSchema)
      .shape({
        name: Nope.string()
          .min(4)
          .required(),
      });

    userSchema.validate({
      name: 'Jonathan',
      password: 'birdybird',
      confirmPassworod: 'burdyburd',
    }); // returns { confirmPassword: 'Passwords don\'t match' }
    ```

  - `validate(entry: object)` - Runs the rule chain against an entry

- `Reference` - allows the schema to reference other values in the provided entry

  - ```js
    const schema = Nope.object().shape({
      email: Nope.string()
        .email()
        .max(255)
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

## Usage with [Formik](https://github.com/jaredpalmer/formik)

Instead of passing it through the `validationSchema` prop, you should call Nope's validate on the `validate` prop as shown in the example below.

```jsx
const schema = Nope.object().shape({
  email: Nope.string()
    .email()
    .max(255)
    .required(),
  password: Nope.string()
    .min(8)
    .max(64)
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
