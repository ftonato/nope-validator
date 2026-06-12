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

  describe('#default / #getDefault', () => {
    it('should return the default value through getDefault()', () => {
      const schema = Nope.string().default('Anonymous');
      expect(schema.getDefault()).toBe('Anonymous');
    });

    it('should return undefined when no default exists', () => {
      expect(Nope.string().getDefault()).toBeUndefined();
    });

    it('should apply the default when the input is undefined', async () => {
      const schema = Nope.string().default('Anonymous').required();
      await validateSyncAndAsync(schema, undefined, undefined);
    });

    it('should not apply the default when the input is null', async () => {
      const schema = Nope.string().default('Anonymous').required();
      await validateSyncAndAsync(schema, null, 'This field is required');
    });

    it('should not apply the default when the input is an empty string', async () => {
      const schema = Nope.string().default('Anonymous').required();
      await validateSyncAndAsync(schema, '', 'This field is required');
    });

    it('should not apply the default when the input is false', async () => {
      const schema = Nope.boolean().default(true).false('must be false');
      await validateSyncAndAsync(schema, false, undefined);
    });

    it('should not apply the default when the input is 0', async () => {
      const schema = Nope.number().default(42).atLeast(0);
      await validateSyncAndAsync(schema, 0, undefined);
    });

    it('should fail validation for invalid provided values even when a default exists', async () => {
      const schema = Nope.string().default('test@example.com').email('invalid email');
      await validateSyncAndAsync(schema, 'not-an-email', 'invalid email');
    });

    it('should expose defaults from child fields on object schemas', () => {
      const schema = Nope.object().shape({
        name: Nope.string().default('Anonymous'),
        active: Nope.boolean().default(true),
      });

      expect(schema.getDefault()).toEqual({ name: 'Anonymous', active: true });
    });
  });

  describe('#nullable / #nonNullable', () => {
    it('should accept null when nullable()', async () => {
      const schema = Nope.string().nullable();
      await validateSyncAndAsync(schema, null, undefined);
    });

    it('should reject null when nonNullable()', async () => {
      const schema = Nope.string().nonNullable('no null');
      await validateSyncAndAsync(schema, null, 'no null');
    });

    it('should not automatically accept undefined when nullable()', async () => {
      const schema = Nope.string().nullable().defined('must be defined');
      await validateSyncAndAsync(schema, undefined, 'must be defined');
    });

    it('should work with required() when nullable()', async () => {
      const schema = Nope.string().nullable().required();
      await validateSyncAndAsync(schema, null, undefined);
      await validateSyncAndAsync(schema, undefined, 'This field is required');
    });

    it('should work with default() when nullable()', async () => {
      const schema = Nope.string().nullable().default('fallback');
      await validateSyncAndAsync(schema, null, undefined);
      await validateSyncAndAsync(schema, undefined, undefined);
    });

    it('should still pass valid non-null values when nullable()', async () => {
      const schema = Nope.string().nullable().email('invalid');
      await validateSyncAndAsync(schema, 'test@example.com', undefined);
    });

    it('should still fail invalid non-null values when nullable()', async () => {
      const schema = Nope.string().nullable().email('invalid');
      await validateSyncAndAsync(schema, 'not-an-email', 'invalid');
    });
  });

  describe('#defined / #optional / #notRequired', () => {
    it('should reject undefined when defined()', async () => {
      const schema = Nope.string().defined('must be defined');
      await validateSyncAndAsync(schema, undefined, 'must be defined');
    });

    it('should accept undefined when optional()', async () => {
      const schema = Nope.string().optional().email('invalid');
      await validateSyncAndAsync(schema, undefined, undefined);
    });

    it('should accept undefined when notRequired()', async () => {
      const schema = Nope.string().notRequired().email('invalid');
      await validateSyncAndAsync(schema, undefined, undefined);
    });

    it('should not reject valid values when defined()', async () => {
      const schema = Nope.string().defined();
      await validateSyncAndAsync(schema, 'hello', undefined);
    });

    it('should not accept invalid non-undefined values when optional()', async () => {
      const schema = Nope.string().optional().email('invalid');
      await validateSyncAndAsync(schema, 'not-an-email', 'invalid');
    });

    it('should match optional() behavior when notRequired()', async () => {
      const optionalSchema = Nope.string().optional().email('invalid');
      const notRequiredSchema = Nope.string().notRequired().email('invalid');

      for (const value of [undefined, 'test@example.com', 'bad']) {
        expect(optionalSchema.validate(value)).toEqual(notRequiredSchema.validate(value));
      }
    });

    it('should compose with nullable()', async () => {
      const schema = Nope.string().nullable().defined('must be defined');
      await validateSyncAndAsync(schema, null, undefined);
      await validateSyncAndAsync(schema, undefined, 'must be defined');
    });

    it('should compose with required() — last explicit presence rule wins', async () => {
      const schema = Nope.string().optional().required('required');
      await validateSyncAndAsync(schema, undefined, 'required');
    });
  });

  describe('#isValid / #isValidSync', () => {
    it('should return true from isValid() for valid values', async () => {
      const schema = Nope.string().email();
      expect(await schema.isValid('test@example.com')).toBe(true);
    });

    it('should return false from isValid() for invalid values', async () => {
      const schema = Nope.string().email();
      expect(await schema.isValid('invalid')).toBe(false);
    });

    it('should return true from isValidSync() for valid values', () => {
      const schema = Nope.string().email();
      expect(schema.isValidSync('test@example.com')).toBe(true);
    });

    it('should return false from isValidSync() for invalid values', () => {
      const schema = Nope.string().email();
      expect(schema.isValidSync('invalid')).toBe(false);
    });

    it('should not throw validation errors', async () => {
      const schema = Nope.string().required();
      await expect(schema.isValid(undefined)).resolves.toBe(false);
      expect(() => schema.isValidSync(undefined)).not.toThrow();
    });

    it('should respect default()', async () => {
      const schema = Nope.string().default('test@example.com').email();
      expect(await schema.isValid(undefined)).toBe(true);
      expect(schema.isValidSync(undefined)).toBe(true);
    });

    it('should respect nullable()', async () => {
      const schema = Nope.string().nullable().email();
      expect(await schema.isValid(null)).toBe(true);
      expect(schema.isValidSync(null)).toBe(true);
    });

    it('should respect optional()', async () => {
      const schema = Nope.string().optional().email();
      expect(await schema.isValid(undefined)).toBe(true);
      expect(schema.isValidSync(undefined)).toBe(true);
    });

    it('should respect defined()', async () => {
      const schema = Nope.string().defined().email();
      expect(await schema.isValid(undefined)).toBe(false);
      expect(schema.isValidSync(undefined)).toBe(false);
    });
  });
});
