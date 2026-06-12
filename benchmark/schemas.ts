import * as Yup from 'yup';
import * as Nope from '../lib/cjs/index';

const roleItemShape = {
  label: Yup.string().min(1).max(50).required(),
  value: Yup.string().min(1).max(50).required(),
};

const nopeRoleItemShape = {
  label: Nope.string().min(1).max(50).required(),
  value: Nope.string().min(1).max(50).required(),
};

const yupSchema = Yup.object({
  id: Yup.string().uuid().required(),
  companyName: Yup.string().min(2).max(255).required(),
  legalName: Yup.string().min(2).max(255).required(),
  website: Yup.string().url().required(),
  address: Yup.string().max(255).required(),
  country: Yup.string().max(255).required(),
  city: Yup.string().max(255).required(),
  zip: Yup.number().min(1000).max(99999).required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(8).max(64).required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')])
    .required(),
  phone: Yup.string().length(10).required(),
  acceptedTC: Yup.boolean().required(),
  department: Yup.string().default('Engineering').optional(),
  nickname: Yup.string().nullable().optional(),
  role: Yup.array().of(Yup.object(roleItemShape)).length(1).required(),
  tags: Yup.array().of(Yup.string().min(1)).length(2).default(['active', 'verified']),
}).stripUnknown();

const yupAsyncSchema = yupSchema.shape({
  asyncKey: Yup.string().test('test', 'msg', async () => {
    await Promise.resolve(undefined);

    return true;
  }),
});

const nopeSchema = Nope.object()
  .shape({
    id: Nope.string().uuid().required(),
    companyName: Nope.string().min(2).max(255).required(),
    legalName: Nope.string().min(2).max(255).required(),
    website: Nope.string().url().required(),
    address: Nope.string().max(255).required(),
    country: Nope.string().max(255).required(),
    city: Nope.string().max(255).required(),
    zip: Nope.number().between(1000, 99999).required(),
    email: Nope.string().email().required(),
    password: Nope.string().min(8).max(64).required(),
    confirmPassword: Nope.string()
      .oneOf([Nope.ref('password')])
      .required(),
    phone: Nope.string().length(10).required(),
    acceptedTC: Nope.boolean().required(),
    department: Nope.string().default('Engineering').optional(),
    nickname: Nope.string().nullable().optional(),
    role: Nope.array().of(Nope.object().shape(nopeRoleItemShape)).length(1).required(),
    tags: Nope.array().of(Nope.string().min(1)).length(2).default(['active', 'verified']),
  })
  .stripUnknown();

const entry = {
  id: '550e8400-e29b-41d4-a716-446655440000',
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
  phone: '1234567890',
  acceptedTC: true,
  nickname: null,
  role: [{ label: 'admin', value: 'admin' }],
  tags: ['active', 'verified'],
  extraField: 'stripped by stripUnknown',
};

const asyncEntry = {
  ...entry,
};

export { yupSchema, yupAsyncSchema, nopeSchema, entry, asyncEntry };
