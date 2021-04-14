import Nope from '..';

describe('#NopeObject', () => {
  describe('#extend', () => {
    it('should extend the schema correctly', () => {
      const schema1 = Nope.object().shape({
        name: Nope.string().min(5, 'minNameMessage'),
        password: Nope.string().min(4, 'minPWMessage'),
      });

      const schema2 = Nope.object().extend(schema1);

      expect(
        schema2.validate({
          name: 'test',
          password: 'magic',
        }),
      ).toEqual({
        name: 'minNameMessage',
      });
    });

    it('should extend the schema correctly with own validators', () => {
      const schema1 = Nope.object().shape({
        name: Nope.string().min(5, 'minNameMessage'),
      });

      const schema2 = Nope.object()
        .extend(schema1)
        .shape({
          password: Nope.string().min(4, 'minPWMessage'),
        });

      expect(
        schema2.validate({
          name: 'magical',
          password: 'pw',
        }),
      ).toEqual({
        password: 'minPWMessage',
      });
    });

    it('should extend the schema correctly with own validators in reverse', () => {
      const schema1 = Nope.object().shape({
        name: Nope.string().min(5, 'minNameMessage'),
      });

      const schema2 = Nope.object()
        .shape({
          password: Nope.string().min(4, 'minPWMessage'),
        })
        .extend(schema1);

      expect(
        schema2.validate({
          name: 'magical',
          password: 'pw',
        }),
      ).toEqual({
        password: 'minPWMessage',
      });
    });

    it('should extend the schema correctly with own validators and references', () => {
      const schema1 = Nope.object().shape({
        password: Nope.string().min(5, 'minPwMessage'),
        password2: Nope.string().oneOf([Nope.ref('password')], 'pwMatchError'),
      });

      const schema2 = Nope.object()
        .extend(schema1)
        .shape({
          name: Nope.string().min(4, 'nameError'),
        });

      expect(
        schema2.validate({
          name: 'magical',
          password: 'password',
          password2: 'password2',
        }),
      ).toEqual({
        password2: 'pwMatchError',
      });
    });

    it('should extend the schema correctly with own validators and references in reverse', () => {
      const schema1 = Nope.object().shape({
        password: Nope.string().min(5, 'minPwMessage'),
        password2: Nope.string().oneOf([Nope.ref('password')], 'pwMatchError'),
      });

      const schema2 = Nope.object()
        .shape({
          name: Nope.string().min(4, 'nameError'),
        })
        .extend(schema1);

      expect(
        schema2.validate({
          name: 'magical',
          password: 'password',
          password2: 'password2',
        }),
      ).toEqual({
        password2: 'pwMatchError',
      });
    });
  });

  describe('noUnknown', () => {
    it('should not allow unknown keys', () => {
      const schema = Nope.object()
        .shape({
          a: Nope.string(),
          b: Nope.number(),
        })
        .noUnknown('noUnknownError');

      expect(
        schema.validate({
          a: 'magic',
          b: 42,
        }),
      ).toBeUndefined();

      expect(
        schema.validate({
          a: 'magic',
          b: 42,
          c: 5,
        }),
      ).toBe('noUnknownError');
    });

    it('should throw an error if used wrongly', () => {
      const schema = Nope.object().noUnknown();

      expect(() => {
        schema.validate({ a: 42 });
      }).toThrowError();
    });
  });

  describe('consistency', () => {
    it('should be consistent', () => {
      const schema = Nope.object().shape({
        email: Nope.string().email('error'),
        url: Nope.string().url('urlError'),
      });

      let resp = schema.validate({
        email: 'test@test.com',
        url: 'https://google.com',
      });
      expect(resp).toBeUndefined();
      resp = schema.validate({
        email: 'test@test.com',
        url: 'https://google.com',
      });
      expect(resp).toBeUndefined();
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
    it('should work', () => {
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

      expect(schema.validate(validInput)).toEqual(undefined);
      expect(schema.validate(invalidInput)).toEqual({
        user: {
          name: 'req',
        },
      });
    });

    it('should work when going back to the parent', () => {
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

      expect(schema.validate(validInput1)).toEqual(undefined);
      expect(schema.validate(invalidInput1)).toEqual({
        user: {
          name: 'required',
        },
      });
      expect(schema.validate(invalidInput2)).toEqual({
        user: {
          name: 'not allowed',
        },
      });
      expect(schema.validate(invalidInput3)).toEqual({
        shouldCreateUser: 'reqbool',
        user: {
          name: 'not allowed',
        },
      });
      expect(schema.validate(invalidInput3, undefined, { abortEarly: true })).toEqual({
        shouldCreateUser: 'reqbool',
      });
    });

    it('should work with refs', () => {
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

      expect(schema.validate(validInput1)).toEqual(undefined);
      expect(schema.validate(invalidInput1)).toEqual({
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
            return;
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
  });
});
