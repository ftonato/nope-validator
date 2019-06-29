import Nope from '..';

describe('#NopeString', () => {
  describe('#regex', () => {
    it('should return undefined for an empty entry', () => {
      expect(
        Nope.string()
          .regex(/abc/i, 'urlErrorMessage')
          .validate(undefined),
      ).toBe(undefined);
    });

    it('should return an error message for an invalid entry', () => {
      expect(
        Nope.string()
          .regex(/abc/i, 'errorMessage')
          .validate('http:google.com'),
      ).toBe('errorMessage');
    });

    it('should return undefined for an valid entry', () => {
      expect(
        Nope.string()
          .regex(/abc/i)
          .validate('abc'),
      ).toBe(undefined);
    });
  });

  describe('#url', () => {
    it('should return undefined for an empty entry', () => {
      expect(
        Nope.string()
          .url('urlErrorMessage')
          .validate(undefined),
      ).toBe(undefined);
    });

    it('should return an error message for an invalid URL', () => {
      expect(
        Nope.string()
          .url()
          .validate('http:google.com'),
      ).toBe('Input is not a valid url');
    });

    it('should return undefined for an valid URL', () => {
      expect(
        Nope.string()
          .url('urlErrorMessage')
          .validate('https://google.com'),
      ).toBe(undefined);
    });
  });

  describe('#email', () => {
    it('should return undefined for an empty entry', () => {
      expect(
        Nope.string()
          .email('emailErrorMessage')
          .validate(undefined),
      ).toBe(undefined);
    });

    it('should return an error message for an invalid email', () => {
      expect(
        Nope.string()
          .email()
          .validate('bruno.vegogmail.com'),
      ).toBe('Input is not a valid email');
    });

    it('should return undefined for an valid email', () => {
      expect(
        Nope.string()
          .email('emailErrorMessage')
          .validate('bruno.vego@gmail.com'),
      ).toBe(undefined);
    });
  });

  describe('#min', () => {
    it('should return undefined for an empty entry', () => {
      expect(
        Nope.string()
          .min(5, 'minLengthErrorMessage')
          .validate(undefined),
      ).toBe(undefined);
    });

    it('should return an error message for an entry that is shorter or equal to the threshold', () => {
      expect(
        Nope.string()
          .min(5)
          .validate('tour'),
      ).toBe('Input is too short');
    });

    it('should return undefined for an entry longer than the threshold', () => {
      expect(
        Nope.string()
          .min(5, 'minLengthErrorMessage')
          .validate('magicalmystery'),
      ).toBe(undefined);
    });
  });

  describe('#max', () => {
    it('should return undefined for an empty entry', () => {
      expect(
        Nope.string()
          .max(5, 'maxLengthErrorMessage')
          .validate(undefined),
      ).toBe(undefined);
    });

    it('should return an error message for an entry that is longer or equal to the max characters', () => {
      expect(
        Nope.string()
          .max(5)
          .validate('magicalmystery'),
      ).toBe('Input is too long');
    });

    it('should return undefined for an entry shorter than threshold', () => {
      expect(
        Nope.string()
          .max(5, 'maxLengthErrorMessage')
          .validate('tour'),
      ).toBe(undefined);
    });
  });
});
