import Nope from '..';
import { validateSyncAndAsync } from './utils';

describe('#NopeArray', () => {
  describe('#required', () => {
    it('should return undefined for a non-nil entry', async () => {
      const validator = Nope.array<any>().required();

      await validateSyncAndAsync(validator, [1, undefined, 'test'], undefined);
      await validateSyncAndAsync(validator, [], undefined);
    });

    it('should return an error message for a nil entry', async () => {
      const validator = Nope.array<any>().required('requiredError');

      await validateSyncAndAsync(validator, undefined, 'requiredError');
      await validateSyncAndAsync(validator, null, 'requiredError');
    });
  });

  describe('#of', () => {
    it('should return undefined for an empty entry', async () => {
      expect(Nope.array<any>().of(Nope.boolean()).validate(undefined)).toBe(undefined);
      expect(await Nope.array<any>().ofAsync(Nope.boolean()).validateAsync(undefined)).toBe(
        undefined,
      );
    });

    it('should return error message for an entry whose values are not all of the required of', async () => {
      expect(Nope.array<any>().of(Nope.number(), 'ofError').validate([1, 2, 'sda'])).toBe(
        'ofError',
      );
      expect(
        await Nope.array<any>().ofAsync(Nope.number(), 'ofError').validateAsync([1, 2, 'sda']),
      ).toBe('ofError');
    });

    it('should return error message for an entry whose values do not get validated differ from primitive validation', async () => {
      expect(Nope.array<any>().of(Nope.number().atLeast(4), 'ofError').validate([6, 5, 3])).toBe(
        'ofError',
      );

      expect(
        await Nope.array<any>()
          .ofAsync(Nope.number().atLeast(4), 'ofError')
          .validateAsync([6, 5, 3]),
      ).toBe('ofError');
    });

    it('should return error message for an entry whose values do not get validated differ from primitive validation', async () => {
      expect(
        Nope.array<any>().of(Nope.number().atLeast(4).atMost(9), 'ofError').validate([6, 5, 10]),
      ).toBe('ofError');

      expect(
        await Nope.array<any>()
          .ofAsync(Nope.number().atLeast(4).atMost(9), 'ofError')
          .validateAsync([6, 5, 10]),
      ).toBe('ofError');
    });

    it('should return undefined for an entry whose values are all of the required of', async () => {
      expect(Nope.array<any>().of(Nope.number().atMost(3)).validate([1, 2, 3])).toBe(undefined);
      expect(
        await Nope.array<any>().ofAsync(Nope.number().atMost(3)).validateAsync([1, 2, 3]),
      ).toBe(undefined);
    });
  });

  describe('#minLength', () => {
    it('should return undefined for an empty or length larger than provided', async () => {
      await validateSyncAndAsync(
        Nope.array<any>().minLength(5, 'minLengthErrorMessage'),
        undefined,
        undefined,
      );

      await validateSyncAndAsync(
        Nope.array<any>().minLength(5, 'minLengthErrorMessage'),
        [1, 2, 3, 4, 5, 6, 7],
        undefined,
      );
    });

    it('should return an error message for an entry shorter than the the threshold', async () => {
      await validateSyncAndAsync(
        Nope.array<any>().minLength(5, 'minLengthErrorMessage'),
        [1, 2, 3, 4],
        'minLengthErrorMessage',
      );
    });

    it('should return an error message for an entry equal to the threshold', async () => {
      await validateSyncAndAsync(
        Nope.array<any>().minLength(4, 'minLengthErrorMessage'),
        [1, 2, 3, 4],
        'minLengthErrorMessage',
      );
    });

    it('should return undefined for an entry longer to the threshold', async () => {
      await validateSyncAndAsync(Nope.array<any>().minLength(4), [1, 2, 3, 4, 5, 6], undefined);
    });
  });

  describe('#maxLength', () => {
    it('should return undefined for an empty entry or an entry smaller than the provided length', async () => {
      await validateSyncAndAsync(
        Nope.array<any>().maxLength(5, 'maxLengthErrorMessage'),
        undefined,
        undefined,
      );

      await validateSyncAndAsync(
        Nope.array<any>().maxLength(5, 'maxLengthErrorMessage'),
        [1, 2, 3, 4],
        undefined,
      );
    });

    it('should return an error message for an entry longer than the the threshold', async () => {
      await validateSyncAndAsync(
        Nope.array<any>().maxLength(5),
        [1, 2, 3, 4, 5, 6],
        'Input is too long',
      );
    });

    it('should return an error message for an entry equal to the threshold', async () => {
      await validateSyncAndAsync(Nope.array<any>().maxLength(4), [1, 2, 3, 4], 'Input is too long');
    });

    it('should return undefined for an entry shorter to the threshold', async () => {
      await validateSyncAndAsync(Nope.array<any>().maxLength(4), [1, 2, 3], undefined);
    });
  });

  describe('#mustContain', () => {
    it('should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(Nope.array<any>().mustContain(2), undefined, undefined);
    });

    it('should return error message for an entry not containing the value passed', async () => {
      await validateSyncAndAsync(
        Nope.array<any>().mustContain(2, 'containError'),
        [1, 3, 4],
        'containError',
      );
    });

    it('should return undefined for an entry containing the value passed', async () => {
      await validateSyncAndAsync(
        Nope.array<any>().mustContain(2, 'containError'),
        [1, 2, 3, 4],
        undefined,
      );
    });

    it('should return undefined for an entry containing the value passed more than once', async () => {
      await validateSyncAndAsync(
        Nope.array<any>().mustContain(2, 'containError'),
        [1, 2, 3, 2, 4, 2],
        undefined,
      );
    });
  });

  describe('#hasOnly', () => {
    it('should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(Nope.array<any>().hasOnly([1, 2, 3]), undefined, undefined);
    });

    it('should return error message for an entry not containing any value passed', async () => {
      await validateSyncAndAsync(
        Nope.array<any>().hasOnly([1, 2, 3], 'validateError'),
        [4, 5, 6],
        'validateError',
      );
    });

    it('should return error message for an entry having different values from hasOnly', async () => {
      await validateSyncAndAsync(
        Nope.array<any>().hasOnly([1, 2, 3], 'validateError'),
        [1, 2, 3, 4, 5, 6],
        'validateError',
      );
    });

    it('should return undefined for having correct values', async () => {
      await validateSyncAndAsync(
        Nope.array<any>().hasOnly([1, 2, 3], 'validateError'),
        [1, 2, 3],
        undefined,
      );
    });

    it('should return for correct object comparison', async () => {
      expect(
        Nope.array<any>()
          .of(Nope.array<any>().of(Nope.string()))
          .hasOnly([['a']])
          .validate([['a']]),
      ).toBe(undefined);

      expect(
        await Nope.array<any>()
          .ofAsync(Nope.array<any>().ofAsync(Nope.string()))
          .hasOnly([['a']])
          .validateAsync([['a']]),
      ).toBe(undefined);
    });

    it('should return an error message for invalid object comparison', async () => {
      expect(
        Nope.array<any>()
          .of(Nope.array<any>().of(Nope.string()))
          .hasOnly([['a']], 'invalidEntries')
          .validate([['b']]),
      ).toBe('invalidEntries');

      expect(
        await Nope.array<any>()
          .ofAsync(Nope.array<any>().ofAsync(Nope.string()))
          .hasOnly([['a']], 'invalidEntries')
          .validateAsync([['b']]),
      ).toBe('invalidEntries');

      expect(
        Nope.array<any>()
          .of(Nope.array<any>().of(Nope.string()))
          .hasOnly([['a']], 'invalidEntries')
          .validate([['a']]),
      ).toBe(undefined);

      expect(
        await Nope.array<any>()
          .ofAsync(Nope.array<any>().ofAsync(Nope.string()))
          .hasOnly([['a']], 'invalidEntries')
          .validateAsync([['a']]),
      ).toBe(undefined);
    });
  });

  describe('#every', () => {
    const isEven = (value: number) => value % 2 === 0;

    it('should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(Nope.array<any>().every(isEven), undefined, undefined);
    });

    it('should return undefined for an empty array entry', async () => {
      await validateSyncAndAsync(Nope.array<any>().every(isEven), [], undefined);
    });

    it('should return error message for an entry where some hasOnly fail the callback', async () => {
      await validateSyncAndAsync(
        Nope.array<any>().every(isEven, 'everyError'),
        [2, 4, 5],
        'everyError',
      );
    });

    it('should return undefined for an entry where all hasOnly succeed the callback', async () => {
      await validateSyncAndAsync(Nope.array<any>().every(isEven), [2, 4, 6], undefined);
    });
  });

  describe('#some', () => {
    const isEven = (value: number) => value % 2 === 0;

    it('should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(Nope.array<any>().every(isEven), undefined, undefined);
    });

    it('should return undefined for an empty array entry', async () => {
      await validateSyncAndAsync(Nope.array<any>().some(isEven), undefined, undefined);
    });

    it('should return error message for an entry where all hasOnly fail the callback', async () => {
      await validateSyncAndAsync(
        Nope.array<any>().some(isEven, 'whereSomeError'),
        [1, 3, 5],
        'whereSomeError',
      );
    });

    it('should return undefined for an entry where one value succeed the callback', async () => {
      await validateSyncAndAsync(
        Nope.array<any>().some(isEven, 'whereSomeError'),
        [1, 2, 3],
        undefined,
      );
    });

    it('should return undefined for an entry where all value succeed the callback', async () => {
      await validateSyncAndAsync(
        Nope.array<any>().some(isEven, 'whereSomeError'),
        [2, 4, 6],
        undefined,
      );
    });
  });

  describe('#length', () => {
    it('should accept an array with exact expected length', async () => {
      await validateSyncAndAsync(Nope.array<string>().length(3), ['a', 'b', 'c'], undefined);
    });

    it('should reject an array shorter than expected length', async () => {
      await validateSyncAndAsync(
        Nope.array<string>().length(3),
        ['a'],
        'Must have exactly 3 items',
      );
    });

    it('should reject an array longer than expected length', async () => {
      await validateSyncAndAsync(
        Nope.array<string>().length(3),
        ['a', 'b', 'c', 'd'],
        'Must have exactly 3 items',
      );
    });

    it('should accept empty array with expected length 0', async () => {
      await validateSyncAndAsync(Nope.array<string>().length(0), [], undefined);
    });

    it('should reject empty array with expected length greater than 0', async () => {
      await validateSyncAndAsync(Nope.array<string>().length(2), [], 'Must have exactly 2 items');
    });

    it('should reject non-array values', async () => {
      await validateSyncAndAsync(
        Nope.array<string>().length(2),
        'ab' as any,
        'Must have exactly 2 items',
      );
    });

    it('should reject arrays with invalid child items', async () => {
      await validateSyncAndAsync(
        Nope.array<number>().of(Nope.number().positive()).length(2),
        [1, -1],
        'One or more elements are of invalid type',
      );
    });

    it('should support custom error messages', async () => {
      await validateSyncAndAsync(Nope.array<string>().length(2, 'need two'), ['a'], 'need two');
    });
  });

  describe('#default / #getDefault', () => {
    it('should apply default when input is undefined', async () => {
      const schema = Nope.array<string>().default(['a', 'b']).length(2);
      await validateSyncAndAsync(schema, undefined, undefined);
    });

    it('should not apply default when input is an empty array', async () => {
      const schema = Nope.array<string>().default(['a', 'b']).length(2);
      await validateSyncAndAsync(schema, [], 'Must have exactly 2 items');
    });

    it('should return default through getDefault()', () => {
      const schema = Nope.array<string>().default(['a', 'b']);
      expect(schema.getDefault()).toEqual(['a', 'b']);
    });

    it('should return undefined from getDefault() when no default exists', () => {
      expect(Nope.array<string>().getDefault()).toBeUndefined();
    });
  });

  describe('#nullable / #nonNullable', () => {
    it('should accept null when nullable()', async () => {
      await validateSyncAndAsync(Nope.array<string>().nullable(), null, undefined);
    });

    it('should reject null when nonNullable()', async () => {
      await validateSyncAndAsync(Nope.array<string>().nonNullable('no null'), null, 'no null');
    });

    it('should work with default() when nullable()', async () => {
      const schema = Nope.array<string>().nullable().default(['a']);
      await validateSyncAndAsync(schema, null, undefined);
      await validateSyncAndAsync(schema, undefined, undefined);
    });
  });

  describe('#defined / #optional / #notRequired', () => {
    it('should reject undefined when defined()', async () => {
      const schema = Nope.array<string>().defined('must be defined');
      await validateSyncAndAsync(schema, undefined, 'must be defined');
    });

    it('should accept undefined when optional()', async () => {
      const schema = Nope.array<string>().optional().length(2);
      await validateSyncAndAsync(schema, undefined, undefined);
    });

    it('should accept undefined when notRequired()', async () => {
      const schema = Nope.array<string>().notRequired().length(2);
      await validateSyncAndAsync(schema, undefined, undefined);
    });
  });

  describe('#isValid / #isValidSync', () => {
    it('should validate array schemas', async () => {
      const schema = Nope.array<string>().length(2);
      expect(await schema.isValid(['a', 'b'])).toBe(true);
      expect(schema.isValidSync(['a', 'b'])).toBe(true);
      expect(await schema.isValid(['a'])).toBe(false);
      expect(schema.isValidSync(['a'])).toBe(false);
    });

    it('should not throw validation errors', async () => {
      const schema = Nope.array<string>().required();
      await expect(schema.isValid(undefined)).resolves.toBe(false);
      expect(() => schema.isValidSync(undefined)).not.toThrow();
    });

    it('should respect default()', async () => {
      const schema = Nope.array<string>().default(['a', 'b']).length(2);
      expect(await schema.isValid(undefined)).toBe(true);
      expect(schema.isValidSync(undefined)).toBe(true);
    });

    it('should respect nullable()', async () => {
      const schema = Nope.array<string>().nullable().length(2);
      expect(await schema.isValid(null)).toBe(true);
      expect(schema.isValidSync(null)).toBe(true);
    });

    it('should respect optional()', async () => {
      const schema = Nope.array<string>().optional().length(2);
      expect(await schema.isValid(undefined)).toBe(true);
      expect(schema.isValidSync(undefined)).toBe(true);
    });
  });

  describe('#async', () => {
    it('should resolve properly', async () => {
      const schema = Nope.array<any>()
        .ofAsync(
          Nope.string().test(async (value) => {
            if (value && value.length < 3) {
              return 'error';
            }
          }),
          'too low',
        )
        .test((val) => {
          if (val && val.length === 0) {
            return 'required';
          }
        });

      expect(await schema.validateAsync([])).toBe('required');
      expect(await schema.validateAsync(['42'])).toBe('too low');
      expect(await schema.validateAsync(['422', '42'])).toBe('too low');
      expect(await schema.validateAsync(['777', '777'])).toBe(undefined);
    });
  });
});
