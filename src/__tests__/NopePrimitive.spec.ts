import { NopePrimitive } from '../NopePrimitive';
import Nope from '..';
import { validateSyncAndAsync } from './utils';

class Dummy extends NopePrimitive<string> {}

describe('#NopePrimitive', () => {
  describe('#required', () => {
    it('should return undefined for a non-nil entry', async () => {
      const validator = new Dummy().required();

      await validateSyncAndAsync(validator, 'asd', undefined);
    });

    it('should return an error message for a nil entry', async () => {
      const validator = new Dummy().required('requiredError');

      await validateSyncAndAsync(validator, undefined, 'requiredError');
      await validateSyncAndAsync(validator, null, 'requiredError');
    });
  });

  describe('#notAllowed', () => {
    it('should return undefined for a nil entry', async () => {
      const validator = new Dummy().notAllowed('notAllowed');

      await validateSyncAndAsync(validator, undefined, undefined);
      await validateSyncAndAsync(validator, null, undefined);
    });

    it('should return an error message for a nil entry', async () => {
      const validator = new Dummy().notAllowed('notAllowed');

      await validateSyncAndAsync(validator, '42', 'notAllowed');
    });
  });

  describe('#oneOf', () => {
    it('should return undefined for a non-nil entry', async () => {
      const validator = new Dummy().oneOf(['a', 'b']);

      await validateSyncAndAsync(validator, 'a', undefined);
    });

    it('should return an error message for a invalid option', async () => {
      const validator = new Dummy().oneOf(['a', 'b'], 'oneOfError');

      await validateSyncAndAsync(validator, 'c', 'oneOfError');
    });

    it('should resolve references correctly', async () => {
      const validator1 = Nope.object().shape({
        test: Nope.string(),
        test2: Nope.string().oneOf([Nope.ref('test')]),
      });

      await validateSyncAndAsync(
        validator1,
        {
          test: 'a',
          test2: 'a',
        },
        undefined,
      );

      const validator2 = Nope.object().shape({
        test: Nope.string(),
        test2: Nope.string().oneOf([Nope.ref('test')], 'oneOfErr'),
      });

      await validateSyncAndAsync(
        validator2,
        {
          test: 'a',
          test2: 'b',
        },
        {
          test2: 'oneOfErr',
        },
      );

      const validator3 = Nope.object().shape({
        test: Nope.string(),
        test2: Nope.string().oneOf([Nope.ref('test'), 'c'], 'oneOfErr'),
      });

      await validateSyncAndAsync(
        validator3,
        {
          test: 'a',
          test2: 'c',
        },
        undefined,
      );
    });
  });

  describe('#notOneOf', () => {
    let errorMessage: string;

    beforeAll(() => {
      errorMessage = 'shouldNotMatch';
    });

    it('should return undefined for a non-matching entry', async () => {
      const validator = new Dummy().notOneOf(['a', 'b']);

      await validateSyncAndAsync(validator, 'c', undefined);
    });

    it('should return an error messsage when an entry matches', async () => {
      const validator = new Dummy().notOneOf(['a', 'b'], errorMessage);

      await validateSyncAndAsync(validator, 'b', errorMessage);
    });

    describe('reference tests', () => {
      it('should return undefined when references do not match', async () => {
        const validator = Nope.object().shape({
          key1: Nope.string(),
          key2: Nope.string().notOneOf([Nope.ref('key1')]),
        });

        await validateSyncAndAsync(
          validator,
          {
            key1: 'a',
            key2: 'b',
          },
          undefined,
        );
      });

      it('should return an error message when references match', async () => {
        const validator = Nope.object().shape({
          key1: Nope.string(),
          key2: Nope.string().notOneOf([Nope.ref('key1')], errorMessage),
        });

        await validateSyncAndAsync(
          validator,
          {
            key1: 'a',
            key2: 'a',
          },
          { key2: errorMessage },
        );
      });

      it('should return the error message when there is a non-reference match', async () => {
        const validator = Nope.object().shape({
          key1: Nope.string(),
          key2: Nope.string().notOneOf([Nope.ref('key1'), 'b', 'c'], errorMessage),
        });

        await validateSyncAndAsync(
          validator,
          {
            key1: 'a',
            key2: 'c',
          },
          { key2: errorMessage },
        );
      });
    });
  });

  describe('#test', () => {
    it('should return undefined for a valid value', async () => {
      const validator = new Dummy()
        .test((entry) => {
          if (entry !== '42') {
            return '42Error';
          }
        })
        .required();

      await validateSyncAndAsync(validator, '42', undefined);
    });

    it('should return the error message for an ivalid value', async () => {
      const validator = new Dummy()
        .test((entry) => {
          if (entry !== '42') {
            return '42Error';
          }
        })
        .required();

      await validateSyncAndAsync(validator, '41', '42Error');
    });
  });

  describe('#when', () => {
    it('should work with simple boolean keys', async () => {
      const schema = Nope.object().shape({
        small: Nope.boolean().required(),
        test: Nope.number().when('small', {
          is: true,
          then: Nope.number().max(2, 'should be small'),
          otherwise: Nope.number().min(2, 'should be big'),
        }),
      });

      await validateSyncAndAsync(
        schema,
        {
          small: true,
          test: 3,
        },
        {
          test: 'should be small',
        },
      );
      await validateSyncAndAsync(
        schema,
        {
          small: false,
          test: 1,
        },
        {
          test: 'should be big',
        },
      );

      await validateSyncAndAsync(
        schema,
        {
          small: false,
          test: 5,
        },
        undefined,
      );
    });

    it('should work with multiple boolean keys', async () => {
      const schema = Nope.object().shape({
        small: Nope.boolean().required(),
        positive: Nope.boolean().required(),
        test: Nope.number().when(['small', 'positive'], {
          is: true,
          then: Nope.number().max(2, 'should be small').positive(),
          otherwise: Nope.number().min(2, 'should be big').negative('should be negative'),
        }),
      });

      await validateSyncAndAsync(
        schema,
        {
          small: true,
          positive: false,
          test: 3,
        },
        {
          test: 'should be negative',
        },
      );

      await validateSyncAndAsync(
        schema,
        {
          small: false,
          positive: true,
          test: 3,
        },
        {
          test: 'should be negative',
        },
      );

      await validateSyncAndAsync(
        schema,
        {
          small: true,
          positive: true,
          test: 3,
        },
        {
          test: 'should be small',
        },
      );

      await validateSyncAndAsync(
        schema,
        {
          small: true,
          positive: true,
          test: 1,
        },
        undefined,
      );
    });

    it('should work with a predicate', async () => {
      const schema = Nope.object().shape({
        small: Nope.boolean().required(),
        test: Nope.number().when(['small'], {
          is: true,
          then: Nope.number().max(2, 'should be small'),
          otherwise: Nope.number().min(2, 'should be big'),
        }),
      });

      await validateSyncAndAsync(
        schema,
        {
          small: true,
          test: 3,
        },
        {
          test: 'should be small',
        },
      );

      await validateSyncAndAsync(
        schema,
        {
          small: false,
          test: 1,
        },
        {
          test: 'should be big',
        },
      );

      await validateSyncAndAsync(
        schema,
        {
          small: true,
          test: 1,
        },
        undefined,
      );
    });

    it('should work with a predicate and multiple conditions', async () => {
      const schema = Nope.object().shape({
        num: Nope.number().required(),
        num2: Nope.number().required(),
        test: Nope.number().when(['num', 'num2'], {
          is: (num, num2) => num === 42 || num2 === 42,
          then: Nope.number().max(2, 'should be small'),
          otherwise: Nope.number().min(2, 'should be big'),
        }),
      });

      await validateSyncAndAsync(
        schema,
        {
          num: 42,
          num2: 43,
          test: 3,
        },
        {
          test: 'should be small',
        },
      );

      await validateSyncAndAsync(
        schema,
        {
          num: 41,
          num2: 42,
          test: 3,
        },
        {
          test: 'should be small',
        },
      );

      await validateSyncAndAsync(
        schema,
        {
          num: 41,
          num2: 41,
          test: 3,
        },
        undefined,
      );

      await validateSyncAndAsync(
        schema,
        {
          num: 41,
          num2: 41,
          test: 1,
        },
        {
          test: 'should be big',
        },
      );

      await validateSyncAndAsync(
        schema,
        {
          num: 42,
          num2: 42,
          test: 1,
        },
        undefined,
      );
    });

    it('should validate circulate referencing fields', async () => {
      const schema = Nope.object().shape({
        name: Nope.string().required(),
        pdf: Nope.string().when('csv', {
          is: (csv) => !!csv,
          then: Nope.string(),
          otherwise: Nope.string().required(),
        }),
        csv: Nope.string().when('pdf', {
          is: (pdf) => !!pdf,
          then: Nope.string(),
          otherwise: Nope.string().required(),
        }),
      });

      await validateSyncAndAsync(
        schema,
        {
          name: 'a',
        },
        {
          csv: 'This field is required',
          pdf: 'This field is required',
        },
      );

      await validateSyncAndAsync(
        schema,
        {
          name: 'a',
          csv: 'test',
        },
        undefined,
      );

      await validateSyncAndAsync(
        schema,
        {
          name: 'a',
          pdf: 'test',
        },
        undefined,
      );
    });
  });
});
