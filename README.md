# Nope 🙅

[![Version](https://img.shields.io/npm/v/nope-validator.svg)](https://npm.im/nope-validator)
[![Bundle Size](https://img.shields.io/bundlephobia/min/nope-validator.svg)](https://bundlephobia.com/result?p=nope-validator)
[![Gzip Size](https://img.shields.io/bundlephobia/minzip/nope-validator.svg)](https://bundlephobia.com/result?p=nope-validator)
[![License](https://img.shields.io/npm/l/nope-validator.svg)](LICENSE)

> A lightweight, fast, and synchronous JavaScript validation library. Built for developers who need performance without the bloat.

---

## Why Nope?

**Nope** is a minimal validation library that prioritizes speed and simplicity. Inspired by [Yup](https://github.com/jquense/yup), Nope provides a familiar API while being significantly smaller and **~17x faster** than Yup by focusing exclusively on synchronous validation—which covers the vast majority of use cases.

> See [benchmark results](./benchmark/results.md) for detailed performance metrics and test specifications.

### Key Features

- ⚡ **Fast** - Optimized for performance with synchronous validation
- 📦 **Small** - Minimal bundle size, maximum efficiency
- 🎯 **Simple** - Clean, intuitive API that's easy to learn
- 🔒 **Type Safe** - Full TypeScript support out of the box
- 🚫 **No Exceptions** - Returns error objects instead of throwing errors
- 🔌 **Framework Ready** - Works seamlessly with React Hook Form and Formik

### How It Works

Unlike traditional validators that throw errors, Nope returns error objects. If validation passes, it returns `undefined`. This approach is more predictable and easier to work with in modern JavaScript applications.

---

## Installation

```bash
npm install nope-validator
# or use your preferred package manager (pnpm, yarn, bun, etc)
```

---

## Quick Start

```js
import Nope from 'nope-validator';

// Define your validation schema
const UserSchema = Nope.object().shape({
  name: Nope.string()
    .atLeast(5, 'Please provide a longer name')
    .atMost(255, 'Name is too long!'),
  email: Nope.string().email().required(),
  confirmEmail: Nope.string()
    .oneOf([Nope.ref('email')], 'Emails must match')
    .required(),
});

// Validate data
const errors = UserSchema.validate({
  name: 'John',
  email: 'me@gmail.com',
  confirmEmail: 'me@gmail.com',
});
// Returns: { name: 'Please provide a longer name' }

const valid = UserSchema.validate({
  name: 'Jonathan Livingston',
  email: 'me@gmail.com',
  confirmEmail: 'me@gmail.com',
});
// Returns: undefined (no errors)
```

---

## Framework Integration

### React Hook Form

Nope works seamlessly with React Hook Form using the official resolver:

```jsx
import { nopeResolver } from '@hookform/resolvers/nope';
import { useForm } from 'react-hook-form';
import * as Nope from 'nope-validator';

const schema = Nope.object().shape({
  username: Nope.string().required('Username is required'),
  password: Nope.string().required('Password is required'),
});

function LoginForm({ onSubmit }) {
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

      <input type="password" {...register('password')} />
      {errors.password && <div>{errors.password.message}</div>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Formik

Use Nope with Formik by passing the validation function to the `validate` prop:

```jsx
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Nope from 'nope-validator';

const schema = Nope.object().shape({
  username: Nope.string().required('Username is required'),
  password: Nope.string().required('Password is required'),
});

function LoginForm() {
  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validate={(values) => schema.validate(values)}
      onSubmit={(values) => console.log('Submitted', values)}
    >
      <Form>
        <Field type="text" name="username" />
        <ErrorMessage name="username" component="div" />

        <Field type="password" name="password" />
        <ErrorMessage name="password" component="div" />

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
}
```

---

## Documentation

For complete API documentation, examples, and advanced usage, visit the [documentation wiki](https://github.com/ftonato/nope-validator/wiki).

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/ftonato/nope-validator/blob/master/CONTRIBUTING.md) for details on how to get started.
