// Make sure you build the library before running this code

import * as Yup from 'yup';
import * as Nope from '../lib/cjs/index';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import bench from 'benchmark';

const yupSchema = Yup.object().shape({
  companyName: Yup.string().min(2).max(255).required(),
  legalName: Yup.string().min(2).max(255).required(),
  website: Yup.string().url().required(),
  address: Yup.string().max(255).required(),
  country: Yup.string().max(255).required(),
  city: Yup.string().max(255).required(),
  zip: Yup.number().required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(8).max(64).required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')])
    .required(),
  acceptedTC: Yup.boolean().required(),
  role: Yup.array().of(
    Yup.object().shape({
      label: Yup.string(),
      value: Yup.string(),
    }),
  ),
});

const yupAsyncSchema = yupSchema.shape({
  asyncKey: Yup.string().test('test', 'msg', async () => {
    await Promise.resolve(undefined);

    return true;
  }),
});

const nopeSchema = Nope.object().shape({
  companyName: Nope.string().min(2).max(255).required(),
  legalName: Nope.string().min(2).max(255).required(),
  website: Nope.string().url().required(),
  address: Nope.string().max(255).required(),
  country: Nope.string().max(255).required(),
  city: Nope.string().max(255).required(),
  zip: Nope.number().required(),
  email: Nope.string().email().required(),
  password: Nope.string().min(8).max(64).required(),
  confirmPassword: Nope.string()
    .oneOf([Nope.ref('password')])
    .required(),
  acceptedTC: Nope.boolean().required(),
  role: Nope.array().of(
    Nope.object().shape({
      label: Nope.string(),
      value: Nope.string(),
    }),
  ),
});

const nopeAsyncSchema = Nope.object()
  .extend(nopeSchema)
  .shape({
    asyncKey: Nope.string().test(async () => {
      const res = await Promise.resolve(undefined);

      return res;
    }),
  });

const entry = {
  companyName: 'company name',
  legalName: 'legal name',
  website: 'https://website.com',
  address: 'Address 1',
  country: 'Europe',
  city: 'England',
  zip: 21000,
  email: 'email.test@gmail.com',
  password: 'passypass',
  confirmPassword: 'passypass',
  acceptedTC: true,
  role: [{ label: 'admin', value: 'admin' }],
};

const asyncEntry = {
  ...entry,
};

const suite = new bench.Suite('test');
suite
  .add('nopeSync', () => {
    nopeSchema.validate(entry);
  })

  .add('yupSync', () => {
    try {
      yupSchema.validateSync(entry);
    } catch (_) {}
  })
  .add('nopeAsync', async () => {
    await nopeAsyncSchema.validateAsync(asyncEntry);
  })
  .add('yupAsync', async () => {
    try {
      await yupAsyncSchema.validate(asyncEntry);
    } catch (_) {}
  })
  .on('cycle', function (event: any) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    console.log('Fastest is ' + this.filter('fastest').map('name'));
    process.exit(0);
  })
  .run({ async: true });
