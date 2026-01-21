# Nope 🙅

[![Fast](https://badgen.now.sh/badge/speed/really%20fast/green)](https://npm.im/nope-validator)
[![Version](https://img.shields.io/npm/v/nope-validator.svg)](https://npm.im/nope-validator)
[![size](https://img.shields.io/bundlephobia/min/nope-validator.svg)](https://bundlephobia.com/result?p=nope-validator)
[![gzip](https://img.shields.io/bundlephobia/minzip/nope-validator.svg)](https://bundlephobia.com/result?p=nope-validator)

> <sup>This project was created by the awesome **[Bruno Vego - @bvego](https://github.com/bvego)**, and is currently maintained by [@ftonato](https://github.com/ftonato) and the community.</sup>

---

A small, simple and fast JS validator. Like, wow thats fast. 🚀

Nope's API is ~~heavily inspired~~ stolen from [Yup](https://github.com/jquense/yup) but Nope attempts to be much smaller and much faster. To achieve this Nope only allows for synchronous data validation which should cover most of the use cases.

### Note: Nope is not a plug-and-play replacement for Yup, in some cases at least.

Instead of throwing errors Nope simply returns the error object and if there are no errors it returns undefined.

For more details on what's available in Nope, check out the [documentation](https://github.com/ftonato/nope-validator/wiki).

Typescript definitions included. ✨

- [Getting started](#getting-started)
- [Usage with react-hook-form](#usage-with-react-hook-form)
- [Usage with Formik](#usage-with-formik)

## Getting started

To start using Nope simply do

```sh
pnpm add nope-validator
```

or

```sh
npm install -S nope-validator
```

or (even), do you wanna to **[try it online](https://replit.com/@ftonato/nope-validator-with-nodeJS)**?

```js
// import the dependency on your app

// const Nope = require('nope-validator'); // or
// const { Nope } = require('nope-validator'); // or
import Nope from 'nope-validator';
```

```js
// create a schema

const UserSchema = Nope.object().shape({
  name: Nope.string().atLeast(5, 'Please provide a longer name').atMost(255, 'Name is too long!'),
  email: Nope.string().email().required(),
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

## Usage with [react-hook-form](https://github.com/react-hook-form/react-hook-form)

Huge thanks to the RHF team for making a resolver for nope, enabling you to use nope as a validator in your RHF-controlled forms.

```jsx
import { nopeResolver } from '@hookform/resolvers/nope';
import { useForm } from 'react-hook-form';
import * as Nope from 'nope-validator';

const schema = Nope.object().shape({
  username: Nope.string().required(),
  password: Nope.string().required(),
});

function Component({ onSubmit }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: nopeResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} />
      {errors.username && <div>{errors.username.message}</div>}

      <input {...register('password')} />
      {errors.password && <div>{errors.password.message}</div>}

      <button type="submit">submit</button>
    </form>
  );
}
```

## Usage with [Formik](https://github.com/jaredpalmer/formik)

Instead of passing it through the `validationSchema` prop, you should call Nope's validate on the `validate` prop as shown in the example below.

```jsx
import { Formik } from 'formik';
import * as Nope from 'nope-validator';

const schema = Nope.object().shape({
  username: Nope.string().required(),
  password: Nope.string().required(),
});

function Component({ onSubmit }) {
  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validate={(values) => schema.validate(values)}
      onSubmit={(values) => console.log('Submitted', values)}
    >
      {() => (
        <Form>
          <Field type="username" name="username" />
          <ErrorMessage name="username" component="div" />

          <Field type="password" name="password" />
          <ErrorMessage name="password" component="div" />

          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
}
```

## Contribute

Information describing how to contribute can be found **[here](https://github.com/ftonato/nope-validator/blob/master/CONTRIBUTING.md)** 🎉

## License

[MIT](LICENSE)
