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
    .required(),
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

For more details on what's available in Nope, check out the [documentation](https://github.com/bvego/nope-validator/wiki).

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
