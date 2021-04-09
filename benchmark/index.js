// Make sure you build the library before running this code

const Yup = require('yup');
const Nope = require('..');
const bench = require('benchmark');

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
};

const suite = new bench.Suite('test');
suite
  .add('nope', () => {
    nopeSchema.validate(entry);
  })

  .add('yup', () => {
    try {
      yupSchema.validateSync(entry);
    } catch (_) {}
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
