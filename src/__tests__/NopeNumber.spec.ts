import Nope from '..';

describe('#NopeNumber', () => {
  describe('#min', () => {
    it('(alias for greaterThan) should return undefined for an empty entry', () => {
      expect(Nope.number().min(3, 'minLengthErrorMessage').validate()).toBe(undefined);
    });

    it('(alias for greaterThan) should return an error message for an entry smaller than the threshold', () => {
      expect(Nope.number().min(5).validate(2)).toBe('Input is too small');
    });

    it('(alias for greaterThan) should return an error message for an entry equal to the threshold', () => {
      expect(Nope.number().min(3).validate(3)).toBe('Input is too small');
    });

    it('(alias for greaterThan) should return undefined for an entry greater than the threshold', () => {
      expect(Nope.number().min(5, 'minLengthErrorMessage').validate(6)).toBe(undefined);
    });
  });

  describe('#max', () => {
    it('(alias for lessThan) should return undefined for an empty entry', () => {
      expect(Nope.number().max(5, 'maxLengthErrorMessage').validate()).toBe(undefined);
    });

    it('(alias for lessThan) should return an error message for an entry greater than the threshold', () => {
      expect(Nope.number().max(5).validate(7)).toBe('Input is too large');
    });

    it('(alias for lessThan) should return an error message for an entry equal to the threshold', () => {
      expect(Nope.number().max(4).validate(4)).toBe('Input is too large');
    });

    it('(alias for lessThan) should return undefined for an entry smaller than the threshold', () => {
      expect(Nope.number().max(5, 'maxLengthErrorMessage').validate(2)).toBe(undefined);
    });
  });

  describe('#greaterThan', () => {
    it('should return undefined for an empty entry', () => {
      expect(Nope.number().greaterThan(5, 'greaterThanErrorMessage').validate()).toBe(undefined);
    });

    it('should return an error message for an entry smaller than the threshold', () => {
      expect(Nope.number().greaterThan(5).validate(2)).toBe('Input is too small');
    });

    it('should return an error message for an entry equal to the threshold', () => {
      expect(Nope.number().greaterThan(3).validate(3)).toBe('Input is too small');
    });

    it('should return undefined for an entry greater than the threshold', () => {
      expect(Nope.number().greaterThan(5, 'greaterThanErrorMessage').validate(6)).toBe(undefined);
    });
  });

  describe('#lessThan', () => {
    it('should return undefined for an empty entry', () => {
      expect(Nope.number().lessThan(5, 'lessThanErrorMessage').validate()).toBe(undefined);
    });

    it('should return an error message for an entry greater than the threshold', () => {
      expect(Nope.number().lessThan(5).validate(7)).toBe('Input is too large');
    });

    it('should return an error message for an entry equal to the threshold', () => {
      expect(Nope.number().lessThan(4).validate(4)).toBe('Input is too large');
    });

    it('should return undefined for an entry smaller than the threshold', () => {
      expect(Nope.number().lessThan(5, 'lessThanErrorMessage').validate(2)).toBe(undefined);
    });
  });

  describe('#atLeast', () => {
    it('should return undefined for an empty entry', () => {
      expect(Nope.number().atLeast(5, 'atLeastErrorMessage').validate()).toBe(undefined);
    });

    it('should return an error message for an entry smaller than the the threshold', () => {
      expect(Nope.number().atLeast(5).validate(2)).toBe('Input is too small');
    });

    it('should return undefined for an entry equal to the threshold', () => {
      expect(Nope.number().atLeast(3, 'atLeastErrorMessage').validate(3)).toBe(undefined);
    });

    it('should return undefined for an entry greater than the threshold', () => {
      expect(Nope.number().atLeast(5, 'atLeastErrorMessage').validate(6)).toBe(undefined);
    });
  });

  describe('#atMost', () => {
    it('should return undefined for an empty entry', () => {
      expect(Nope.number().atMost(5, 'atMostErrorMessage').validate()).toBe(undefined);
    });

    it('should return an error message for an entry greater than the theshold', () => {
      expect(Nope.number().atMost(5).validate(7)).toBe('Input is too large');
    });

    it('should return undefined for an entry equal to the threshold', () => {
      expect(Nope.number().atMost(10, 'atMostErrorMessage').validate(10)).toBe(undefined);
    });

    it('should return undefined for an entry smaller than the threshold', () => {
      expect(Nope.number().atMost(5, 'atMostErrorMessage').validate(2)).toBe(undefined);
    });
  });

  describe('#positive', () => {
    it('should return undefined for an empty entry', () => {
      expect(Nope.number().positive().validate()).toBe(undefined);
    });

    it('should return an error message for an entry negative', () => {
      expect(Nope.number().positive().validate(-1)).toBe('Input must be positive');
    });

    it('should return undefined for an entry positive', () => {
      expect(Nope.number().positive('positiveErrorMessage').validate(2)).toBe(undefined);
    });
  });

  describe('#negative', () => {
    it('should return undefined for an empty entry', () => {
      expect(Nope.number().negative().validate()).toBe(undefined);
    });

    it('should return an error message for an entry negative', () => {
      expect(Nope.number().negative().validate(1)).toBe('Input must be negative');
    });

    it('should return undefined for an entry negative', () => {
      expect(Nope.number().negative('negativeErrorMessage').validate(-1)).toBe(undefined);
    });
  });

  describe('#integer', () => {
    it('should return undefined for an empty entry', () => {
      expect(Nope.number().integer().validate()).toBe(undefined);
    });

    it('should return an error message for an entry not an integer', () => {
      expect(Nope.number().integer().validate(3.14)).toBe('Input must be an integer');
    });

    it('should return undefined for an entry an integer', () => {
      expect(Nope.number().integer('integerErrorMessage').validate(1)).toBe(undefined);
    });
  });

  describe('#number', () => {
    it('should return undefined for an empty entry', () => {
      expect(Nope.number('validNumberErrorMessage').integer().validate('integer')).toBe(
        'validNumberErrorMessage',
      );
    });

    it('should return an error message for an entry not an integer', () => {
      expect(Nope.number().integer().validate('one')).toBe('The field is not a valid number');
    });

    it('should return undefined for a string entry of an integer', () => {
      expect(Nope.number().integer('integerErrorMessage').validate('12')).toBe(undefined);
    });
  });
});
