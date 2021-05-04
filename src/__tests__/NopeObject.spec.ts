import Nope from '..';
import { validateSyncAndAsync } from './utils';

describe('#NopeObject', () => {
  describe('#extend', () => {
    it('should extend the schema correctly', async () => {
      const schema1 = Nope.object().shape({
        name: Nope.string().min(5, 'minNameMessage'),
        password: Nope.string().min(4, 'minPWMessage'),
      });

      const schema2 = Nope.object()
        .extend(schema1)
        .shape({
          email: Nope.string().test(async (val) => {
            if (!val) {
              return 'asd';
            }
          }),
        });

      await validateSyncAndAsync(
        schema1,
        { name: 'test', password: 'magic' },
        { name: 'minNameMessage' },
      );

      expect(
        await schema2.validateAsync(
          { name: 'test', password: 'magic' },
          { name: 'minNameMessage', email: 'asd' },
        ),
      );
    });

    it('should extend the schema correctly with own validators', async () => {
      const schema1 = Nope.object().shape({
        name: Nope.string().min(5, 'minNameMessage'),
      });

      const schema2 = Nope.object()
        .extend(schema1)
        .shape({
          password: Nope.string().min(4, 'minPWMessage'),
        });

      await validateSyncAndAsync(
        schema2,
        {
          name: 'magical',
          password: 'pw',
        },
        {
          password: 'minPWMessage',
        },
      );
    });

    it('should extend the schema correctly with own validators in reverse', async () => {
      const schema1 = Nope.object().shape({
        name: Nope.string().min(5, 'minNameMessage'),
      });

      const schema2 = Nope.object()
        .shape({
          password: Nope.string().min(4, 'minPWMessage'),
        })
        .extend(schema1);

      await validateSyncAndAsync(
        schema2,
        { name: 'magical', password: 'pw' },
        {
          password: 'minPWMessage',
        },
      );
    });

    it('should extend the schema correctly with own validators and references', async () => {
      const schema1 = Nope.object().shape({
        password: Nope.string().min(5, 'minPwMessage'),
        password2: Nope.string().oneOf([Nope.ref('password')], 'pwMatchError'),
      });

      const schema2 = Nope.object()
        .extend(schema1)
        .shape({
          name: Nope.string().min(4, 'nameError'),
        });

      await validateSyncAndAsync(
        schema2,
        {
          name: 'magical',
          password: 'password',
          password2: 'password2',
        },
        {
          password2: 'pwMatchError',
        },
      );
    });

    it('should extend the schema correctly with own validators and references in reverse', async () => {
      const schema1 = Nope.object().shape({
        password: Nope.string().min(5, 'minPwMessage'),
        password2: Nope.string().oneOf([Nope.ref('password')], 'pwMatchError'),
      });

      const schema2 = Nope.object()
        .shape({
          name: Nope.string().min(4, 'nameError'),
        })
        .extend(schema1);

      await validateSyncAndAsync(
        schema2,
        {
          name: 'magical',
          password: 'password',
          password2: 'password2',
        },
        {
          password2: 'pwMatchError',
        },
      );
    });
  });

  describe('noUnknown', () => {
    it('should not allow unknown keys', async () => {
      const schema = Nope.object()
        .shape({
          a: Nope.string(),
          b: Nope.number(),
        })
        .noUnknown('noUnknownError');

      await validateSyncAndAsync(schema, { a: 'magic', b: 42 }, undefined);
      await validateSyncAndAsync(schema, { a: 'magic', b: 42, c: 5 }, 'noUnknownError');
    });

    it('should throw an error if used wrongly', () => {
      const schema = Nope.object().noUnknown();

      expect(() => {
        schema.validate({ a: 42 });
      }).toThrowError();
    });
  });

  describe('consistency', () => {
    it('should be consistent', async () => {
      const schema = Nope.object().shape({
        email: Nope.string().email('error'),
        url: Nope.string().url('urlError'),
      });

      const input = {
        email: 'test@test.com',
        url: 'https://google.com',
      };
      await validateSyncAndAsync(schema, input, undefined);
      await validateSyncAndAsync(schema, input, undefined);
    });
  });

  describe('#validateAt', () => {
    it('should work', () => {
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
        foo: [
          { bar: '123' },
          { bar: '123456', loose: true },
          { bar: '123456' },
          { bar: '123', loose: true },
        ],
      };

      expect(schema.validateAt('foo[0].bar', rootValue)).toBe('tooShort');
      expect(schema.validateAt('foo[1].bar', rootValue)).toBe('tooLong');
      expect(schema.validateAt('foo[2].bar', rootValue)).toBe(undefined);
      expect(schema.validateAt('foo[3].bar', rootValue)).toBe(undefined);
    });
  });

  describe('#options - abortEarly', () => {
    it('should work', () => {
      const schema = Nope.object().shape({
        name: Nope.string().min(5, 'minNameMessage'),
        password: Nope.string().min(4, 'minPWMessage'),
      });

      const entry1 = {
        name: '12',
        password: '12',
      };

      expect(schema.validate(entry1, undefined, { abortEarly: false })).toEqual({
        name: 'minNameMessage',
        password: 'minPWMessage',
      });

      expect(schema.validate(entry1, undefined, { abortEarly: true })).toEqual({
        name: 'minNameMessage',
      });
    });
  });

  describe('#nested', () => {
    it('should work', async () => {
      const schema = Nope.object().shape({
        user: Nope.object().shape({
          name: Nope.string().required('req'),
        }),
      });

      const validInput = {
        user: {
          name: '123',
        },
      };

      const invalidInput = {
        user: {
          name: undefined,
        },
      };

      await validateSyncAndAsync(schema, validInput, undefined);
      await validateSyncAndAsync(schema, invalidInput, {
        user: {
          name: 'req',
        },
      });
    });

    it('should work when going back to the parent', async () => {
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
      const invalidInput2 = {
        shouldCreateUser: false,
        user: {
          name: '123',
        },
      };
      const invalidInput3 = {
        user: {
          name: '123',
        },
      };

      await validateSyncAndAsync(schema, validInput1, undefined);
      await validateSyncAndAsync(schema, invalidInput1, {
        user: {
          name: 'required',
        },
      });
      await validateSyncAndAsync(schema, invalidInput2, {
        user: {
          name: 'not allowed',
        },
      });
      await validateSyncAndAsync(schema, invalidInput3, {
        shouldCreateUser: 'reqbool',
        user: {
          name: 'not allowed',
        },
      });
    });

    it('should work with refs', async () => {
      const schema = Nope.object().shape({
        validUsernames: Nope.array<string>().of(Nope.string()),
        user: Nope.object().shape({
          name: Nope.string().oneOf(Nope.ref('../validUsernames'), 'not valid'),
        }),
      });

      const validInput1 = {
        validUsernames: ['megatron'],
        user: {
          name: 'megatron',
        },
      };
      const invalidInput1 = {
        validUsernames: ['megatron'],
        user: {
          name: 'ultron',
        },
      };

      await validateSyncAndAsync(schema, validInput1, undefined);
      await validateSyncAndAsync(schema, invalidInput1, {
        user: {
          name: 'not valid',
        },
      });
    });
  });

  describe('#async', () => {
    it('should work', async () => {
      const schema = Nope.object().shape({
        username: Nope.string().test((str) => {
          if (str) {
            return Promise.resolve(undefined);
          }
          return Promise.resolve('str');
        }),
      });

      const invalid = { username: undefined };
      const valid = { username: '123' };
      const invalidErrors = await schema.validateAsync(invalid);

      expect(invalidErrors).toEqual({
        username: 'str',
      });

      const validErrors = await schema.validateAsync(valid);
      expect(validErrors).toEqual(undefined);
    });

    it('shoudld work with a simulated API call', async () => {
      const divideBy2 = async (num: number) => {
        await new Promise((res) => setTimeout(res, 10));
        return num / 2;
      };

      const schema = Nope.object().shape({
        num: Nope.number().test(async (val) => {
          const res = await divideBy2(val);

          if (res !== 42) {
            return 'error';
          }
        }),
      });

      expect(
        await schema.validateAsync({
          num: 84,
        }),
      ).toBe(undefined);
      expect(
        await schema.validateAsync({
          num: 83,
        }),
      ).toEqual({
        num: 'error',
      });
    });
  });
});
