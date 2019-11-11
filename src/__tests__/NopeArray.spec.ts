import Nope from '..';

describe('#NopeArray', () => {
  describe('#required', () => {
    it('should return undefined for a non-nil entry', () => {
      const validator = Nope.array().required();
      expect(validator.validate([1, undefined, 'test'])).toEqual(undefined);
      expect(validator.validate([])).toEqual(undefined);
    });
    it('should return an error message for a nil entry', () => {
      const validator = Nope.array().required('requiredError');

      expect(validator.required().validate(undefined)).toEqual('requiredError');
      expect(validator.required().validate(null)).toEqual('requiredError');
    });
  });

  describe('#of', () => {
    it('should return undefined for an empty entry', () => {
      expect(
        Nope.array()
          .of(Nope.boolean())
          .validate(undefined),
      ).toBe(undefined);
    });

    it('should return error message for an entry whose values are not all of the required of', () => {
      expect(
        Nope.array()
          .of(Nope.number(), 'ofError')
          .validate([1, 2, 'sda']),
      ).toBe('ofError');
    });

    it('should return error message for an entry whose values do not get validated differ from primitive validation', () => {
      expect(
        Nope.array()
          .of(Nope.number().atLeast(4), 'ofError')
          .validate([6, 5, 3]),
      ).toBe('ofError');
    });

    it('should return error message for an entry whose values do not get validated differ from primitive validation', () => {
      expect(
        Nope.array()
          .of(
            Nope.number()
              .atLeast(4)
              .atMost(9),
            'ofError',
          )
          .validate([6, 5, 10]),
      ).toBe('ofError');
    });

    it('should return undefined for an entry whose values are all of the required of', () => {
      expect(
        Nope.array()
          .of(Nope.number().atMost(3))
          .validate([1, 2, 3]),
      ).toBe(undefined);
    });
  });

  describe('#minLength', () => {
    it('should return undefined for an empty entry', () => {
      expect(
        Nope.array()
          .minLength(5, 'minLengthErrorMessage')
          .validate(undefined),
      ).toBe(undefined);
    });

    it('should return an error message for an entry shorter than the the threshold', () => {
      expect(
        Nope.array()
          .minLength(5)
          .validate([1, 2, 3, 4]),
      ).toBe('Input is too short');
    });

    it('should return an error message for an entry equal to the threshold', () => {
      expect(
        Nope.array()
          .minLength(4)
          .validate([1, 2, 3, 4]),
      ).toBe('Input is too short');
    });

    it('should return undefined for an entry longer to the threshold', () => {
      expect(
        Nope.array()
          .minLength(4)
          .validate([1, 2, 3, 4, 5, 6]),
      ).toBe(undefined);
    });
  });

  describe('#maxLength', () => {
    it('should return undefined for an empty entry', () => {
      expect(
        Nope.array()
          .maxLength(5, 'maxLengthErrorMessage')
          .validate(undefined),
      ).toBe(undefined);
    });

    it('should return an error message for an entry longer than the the threshold', () => {
      expect(
        Nope.array()
          .maxLength(5)
          .validate([1, 2, 3, 4, 5, 6]),
      ).toBe('Input is too long');
    });

    it('should return an error message for an entry equal to the threshold', () => {
      expect(
        Nope.array()
          .maxLength(4)
          .validate([1, 2, 3, 4]),
      ).toBe('Input is too long');
    });

    it('should return undefined for an entry shorter to the threshold', () => {
      expect(
        Nope.array()
          .maxLength(4)
          .validate([1, 2, 3]),
      ).toBe(undefined);
    });
  });

  describe('#mustContain', () => {
    it('should return undefined for an empty entry', () => {
      expect(
        Nope.array()
          .mustContain(2)
          .validate(undefined),
      ).toBe(undefined);
    });

    it('should return error message for an entry not containing the value passed', () => {
      expect(
        Nope.array()
          .mustContain(2, 'containError')
          .validate([1, 3, 4]),
      ).toBe('containError');
    });

    it('should return undefined for an entry containing the value passed', () => {
      expect(
        Nope.array()
          .mustContain(2, 'containError')
          .validate([1, 2, 3, 4]),
      ).toBe(undefined);
    });

    it('should return undefined for an entry containing the value passed more than once', () => {
      expect(
        Nope.array()
          .mustContain(2, 'containError')
          .validate([1, 2, 3, 2, 4, 2]),
      ).toBe(undefined);
    });
  });

  describe('#hasOnly', () => {
    it('should return undefined for an empty entry', () => {
      expect(
        Nope.array()
          .hasOnly([1, 2, 3])
          .validate(undefined),
      ).toBe(undefined);
    });

    it('should return error message for an entry not containing any value passed', () => {
      expect(
        Nope.array()
          .hasOnly([1, 2, 3], 'validateError')
          .validate([4, 5, 6]),
      ).toBe('validateError');
    });

    it('should return error message for an entry having different hasOnly from hasOnly passed', () => {
      expect(
        Nope.array()
          .hasOnly([1, 2, 3], 'validateError')
          .validate([1, 2, 3, 4, 5, 6]),
      ).toBe('validateError');
    });

    it('should return undefined for an entry having only hasOnly from hasOnly passed', () => {
      expect(
        Nope.array()
          .hasOnly([1, 2, 3], 'validateError')
          .validate([1, 2, 1, 1, 3, 2]),
      ).toBe(undefined);
    });
  });

  describe('#every', () => {
    const isEven = (value: number) => value % 2 === 0;

    it('should return undefined for an empty entry', () => {
      expect(
        Nope.array()
          .every(isEven)
          .validate(undefined),
      ).toBe(undefined);
    });

    it('should return undefined for an empty array entry', () => {
      expect(
        Nope.array()
          .every(isEven)
          .validate([]),
      ).toBe(undefined);
    });

    it('should return error message for an entry where some hasOnly fail the callback', () => {
      expect(
        Nope.array()
          .every(isEven, 'everyError')
          .validate([2, 4, 5]),
      ).toBe('everyError');
    });

    it('should return undefined for an entry where all hasOnly succeed the callback', () => {
      expect(
        Nope.array()
          .every(isEven)
          .validate([2, 4, 6]),
      ).toBe(undefined);
    });
  });

  describe('#some', () => {
    const isEven = (value: number) => value % 2 === 0;

    it('should return undefined for an empty entry', () => {
      expect(
        Nope.array()
          .some(isEven)
          .validate(undefined),
      ).toBe(undefined);
    });

    it('should return undefined for an empty array entry', () => {
      expect(
        Nope.array()
          .some(isEven)
          .validate([]),
      ).toBe(undefined);
    });

    it('should return error message for an entry where all hasOnly fail the callback', () => {
      expect(
        Nope.array()
          .some(isEven, 'whereSomeError')
          .validate([1, 3, 5]),
      ).toBe('whereSomeError');
    });

    it('should return undefined for an entry where one value succeed the callback', () => {
      expect(
        Nope.array()
          .some(isEven)
          .validate([1, 2, 3]),
      ).toBe(undefined);
    });

    it('should return undefined for an entry where all value succeed the callback', () => {
      expect(
        Nope.array()
          .some(isEven)
          .validate([2, 4, 6]),
      ).toBe(undefined);
    });
  });
});
