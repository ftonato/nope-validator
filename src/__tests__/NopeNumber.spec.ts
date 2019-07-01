import Nope from '..';

describe('#NopeNumber', () => {
  describe('#min', () => {
    it('should return undefined for an empty entry', () => {
      expect(
        Nope.number()
          .min(5, 'minErrorMessage')
          .validate(),
      ).toBe(undefined);
    });

    it('should return an error message for an entry that is smaller or equal to the threshold', () => {
      expect(
        Nope.number()
          .min(5)
          .validate(2),
      ).toBe('Input is too small');
    });

    it('should return undefined for an entry greater than the threshold', () => {
      expect(
        Nope.number()
          .min(5, 'minErrorMessage')
          .validate(6),
      ).toBe(undefined);
    });
  });

  describe('#max', () => {
    it('should return undefined for an empty entry', () => {
      expect(
        Nope.number()
          .max(5, 'maxErrorMessage')
          .validate(),
      ).toBe(undefined);
    });

    it('should return an error message for an entry that is greater than or equal to the max characters', () => {
      expect(
        Nope.number()
          .max(5)
          .validate(7),
      ).toBe('Input is too large');
    });

    it('should return undefined for an entry smaller than the threshold', () => {
      expect(
        Nope.number()
          .max(5, 'maxErrorMessage')
          .validate(2),
      ).toBe(undefined);
    });
  });

  describe('#max', () => {
    it('should return undefined for an empty entry', () => {
      expect(
        Nope.number()
          .max(5, 'maxErrorMessage')
          .validate(),
      ).toBe(undefined);
    });

    it('should return an error message for an entry that is greater than or equal to the max characters', () => {
      expect(
        Nope.number()
          .max(5)
          .validate(7),
      ).toBe('Input is too large');
    });

    it('should return undefined for an entry smaller than the threshold', () => {
      expect(
        Nope.number()
          .max(5, 'maxErrorMessage')
          .validate(2),
      ).toBe(undefined);
    });
  });

  describe('#positive', () => {
    it('should return undefined for an empty entry', () => {
      expect(
        Nope.number()
          .positive()
          .validate(),
      ).toBe(undefined);
    });

    it('should return an error message for an entry that is negative', () => {
      expect(
        Nope.number()
          .positive()
          .validate(-1),
      ).toBe('Input must be positive');
    });

    it('should return undefined for an entry that is positive', () => {
      expect(
        Nope.number()
          .positive('positiveErrorMessage')
          .validate(2),
      ).toBe(undefined);
    });
  });

  describe('#negative', () => {
    it('should return undefined for an empty entry', () => {
      expect(
        Nope.number()
          .negative()
          .validate(),
      ).toBe(undefined);
    });

    it('should return an error message for an entry that is negative', () => {
      expect(
        Nope.number()
          .negative()
          .validate(1),
      ).toBe('Input must be negative');
    });

    it('should return undefined for an entry that is negative', () => {
      expect(
        Nope.number()
          .negative('negativeErrorMessage')
          .validate(-1),
      ).toBe(undefined);
    });
  });
  describe('#integer', () => {
    it('should return undefined for an empty entry', () => {
      expect(
        Nope.number()
          .integer()
          .validate(),
      ).toBe(undefined);
    });

    it('should return an error message for an entry that is not an integer', () => {
      expect(
        Nope.number()
          .integer()
          .validate(3.14),
      ).toBe('Input must be an integer');
    });

    it('should return undefined for an entry that is an integer', () => {
      expect(
        Nope.number()
          .integer('integerErrorMessage')
          .validate(1),
      ).toBe(undefined);
    });
  });
});
