import Nope from '..';

describe('#NopeString', () => {
  describe('#regex', () => {
    it('should return undefined for an empty entry', () => {
      expect(Nope.string().regex(/abc/i, 'urlErrorMessage').validate(undefined)).toBe(undefined);
    });

    it('should return an error message for an invalid entry', () => {
      expect(Nope.string().regex(/abc/i, 'errorMessage').validate('http:google.com')).toBe(
        'errorMessage',
      );
    });

    it('should return undefined for an valid entry', () => {
      expect(Nope.string().regex(/abc/i).validate('abc')).toBe(undefined);
    });
  });

  describe('#url', () => {
    it('should return undefined for an empty entry', () => {
      expect(Nope.string().url('urlErrorMessage').validate(undefined)).toBe(undefined);
    });

    it('should return an error message for an invalid URL', () => {
      expect(Nope.string().url().validate('http:google.com')).toBe('Input is not a valid url');
    });

    it('should return undefined for an valid URL', () => {
      expect(Nope.string().url('urlErrorMessage').validate('https://google.com')).toBe(undefined);
    });
  });

  describe('#email', () => {
    it('should return undefined for an empty entry', () => {
      expect(Nope.string().email('emailErrorMessage').validate(undefined)).toBe(undefined);
    });

    it('should return an error message for an invalid email', () => {
      expect(Nope.string().email().validate('bruno.vegogmail.com')).toBe(
        'Input is not a valid email',
      );
    });

    it('should return undefined for an valid email', () => {
      expect(Nope.string().email('emailErrorMessage').validate('bruno.vego@gmail.com')).toBe(
        undefined,
      );
    });
  });

  describe('#min', () => {
    it('(alias for greaterThan) should return undefined for an empty entry', () => {
      expect(Nope.string().min(5, 'minLengthErrorMessage').validate(undefined)).toBe(undefined);
    });

    it('(alias for greaterThan) should return an error message for an entry shorter than the the threshold', () => {
      expect(Nope.string().min(5).validate('tour')).toBe('Input is too short');
    });

    it('(alias for greaterThan) should return an error message for an entry shorter than the the threshold', () => {
      expect(Nope.string().min(5).validate(6)).toBe('Input is too short');
    });

    it('(alias for greaterThan) should return an error message for an entry equal to the threshold', () => {
      expect(Nope.string().min(4).validate('tour')).toBe('Input is too short');
    });

    it('(alias for greaterThan) should return undefined for an entry longer than the threshold', () => {
      expect(Nope.string().min(5, 'minLengthErrorMessage').validate('magicalmystery')).toBe(
        undefined,
      );
    });
  });

  describe('#max', () => {
    it('(alias for lessThan) should return undefined for an empty entry', () => {
      expect(Nope.string().max(5, 'maxLengthErrorMessage').validate(undefined)).toBe(undefined);
    });

    it('(alias for lessThan) should return an error message for an entry longer than the the threshold', () => {
      expect(Nope.string().max(5).validate('magicalmystery')).toBe('Input is too long');
    });

    it('(alias for lessThan) should return an error message for an entry equal to the threshold', () => {
      expect(Nope.string().max(14).validate('magicalmystery')).toBe('Input is too long');
    });

    it('(alias for lessThan) should return undefined for an entry shorter than threshold', () => {
      expect(Nope.string().max(5, 'maxLengthErrorMessage').validate('tour')).toBe(undefined);
    });
  });

  describe('#greaterThan', () => {
    it('should return undefined for an empty entry', () => {
      expect(Nope.string().greaterThan(5, 'greaterThanErrorMessage').validate(undefined)).toBe(
        undefined,
      );
    });

    it('should return an error message for an entry shorter than the threshold', () => {
      expect(Nope.string().greaterThan(5).validate('tour')).toBe('Input is too short');
    });

    it('should return an error message for an entry equal to the threshold', () => {
      expect(Nope.string().greaterThan(4).validate('tour')).toBe('Input is too short');
    });

    it('should return undefined for an entry longer than the threshold', () => {
      expect(
        Nope.string().greaterThan(5, 'greaterThanErrorMessage').validate('magicalmystery'),
      ).toBe(undefined);
    });
  });

  describe('#lessThan', () => {
    it('should return undefined for an empty entry', () => {
      expect(Nope.string().lessThan(5, 'lessThanErrorMessage').validate(undefined)).toBe(undefined);
    });

    it('should return an error message for an entry longer than the threshold', () => {
      expect(Nope.string().lessThan(5).validate('magicalmystery')).toBe('Input is too long');
    });

    it('should return an error message for an entry equal to the threshold', () => {
      expect(Nope.string().lessThan(14).validate('magicalmystery')).toBe('Input is too long');
    });

    it('should return undefined for an entry shorter than threshold', () => {
      expect(Nope.string().lessThan(5, 'lessThanErrorMessage').validate('tour')).toBe(undefined);
    });
  });

  describe('#atLeast', () => {
    it('should return undefined for an empty entry', () => {
      expect(Nope.string().atLeast(5, 'atLeastErrorMessage').validate(undefined)).toBe(undefined);
    });

    it('should return an error message for an entry shorter than the threshold', () => {
      expect(Nope.string().atLeast(5).validate('tour')).toBe('Input is too short');
    });

    it('should return undefined for an entry equal to the threshold', () => {
      expect(Nope.string().atLeast(4, 'atLeastErrorMessage').validate('tour')).toBe(undefined);
    });

    it('should return undefined for an entry longer than the threshold', () => {
      expect(Nope.string().atLeast(5, 'atLeastErrorMessage').validate('magicalmystery')).toBe(
        undefined,
      );
    });
  });

  describe('#atMost', () => {
    it('should return undefined for an empty entry', () => {
      expect(Nope.string().atMost(5, 'atMostErrorMessage').validate(undefined)).toBe(undefined);
    });

    it('should return an error message for an entry longer than the threshold', () => {
      expect(Nope.string().atMost(5).validate('magicalmystery')).toBe('Input is too long');
    });

    it('should return undefined for an entry equal to the threshold', () => {
      expect(Nope.string().atMost(4, 'atMostErrorMessage').validate('tour')).toBe(undefined);
    });

    it('should return undefined for an entry shorter than threshold', () => {
      expect(Nope.string().atMost(5, 'atMostErrorMessage').validate('tour')).toBe(undefined);
    });
  });

  describe('#required', () => {
    it('should return requiredMessage for undefined', () => {
      expect(Nope.string().required('requiredMessage').validate(undefined)).toBe('requiredMessage');
    });

    it('should return requiredMessage for null', () => {
      expect(Nope.string().required('requiredMessage').validate(null)).toBe('requiredMessage');
    });

    it('should return requiredMessage for empty string', () => {
      expect(Nope.string().required('requiredMessage').validate('')).toBe('requiredMessage');
    });

    it('should return requiredMessage for a string full of white spaces', () => {
      expect(Nope.string().required('requiredMessage').validate('     ')).toBe('requiredMessage');
    });
  });
});
