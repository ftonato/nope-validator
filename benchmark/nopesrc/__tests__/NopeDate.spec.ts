import Nope from '..';

describe('#NopeDate', () => {
  describe('#before', () => {
    it('should return undefined for an empty entry', () => {
      expect(Nope.date().before('2019-01-01').validate(undefined)).toBe(undefined);
    });

    it('should return an error message for an invalid entry', () => {
      expect(Nope.date().before('2019-01-01', 'beforeError').validate('2019-01-02')).toBe(
        'beforeError',
      );
    });

    it('should return undefined for a valid entry', () => {
      expect(Nope.date().before('2019-01-02').validate('2019-01-01')).toBe(undefined);
    });
  });

  describe('#after', () => {
    it('should return undefined for an empty entry', () => {
      expect(Nope.date().after('2019-01-01').validate(undefined)).toBe(undefined);
    });

    it('should return an error message for an invalid entry', () => {
      expect(Nope.date().after('2019-01-02', 'afterError').validate('2019-01-01')).toBe(
        'afterError',
      );
    });

    it('should return undefined for a valid entry', () => {
      expect(Nope.date().after('2019-01-01').validate('2019-01-02')).toBe(undefined);
    });
  });

  describe('#date', () => {
    it('should return notADate for an invalid date', () => {
      expect(Nope.date().after('2019-01-01').validate('not a date')).toBe(
        'The field is not a valid date',
      );
    });

    it('should return a defined error message for an invalid date', () => {
      expect(Nope.date('dateError').after('2019-01-02', 'afterError').validate('not a date')).toBe(
        'dateError',
      );
    });
  });
});
