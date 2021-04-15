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
    it('should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(
        Nope.array<any>().minLength(5, 'minLengthErrorMessage'),
        undefined,
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
    it('should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(
        Nope.array<any>().maxLength(5, 'maxLengthErrorMessage'),
        undefined,
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

    it('should return error message for an entry having different hasOnly from hasOnly passed', async () => {
      await validateSyncAndAsync(
        Nope.array<any>().hasOnly([1, 2, 3], 'validateError'),
        [1, 2, 3, 4, 5, 6],
        'validateError',
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

  describe('#async', () => {
    it('should resolve properly', async () => {
      const schema = Nope.array<any>()
        .ofAsync(
          Nope.string().test(async (value) => {
            if (value.length < 3) {
              return 'error';
            }
          }),
          'too low',
        )
        .test((val) => {
          if (val.length === 0) {
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
