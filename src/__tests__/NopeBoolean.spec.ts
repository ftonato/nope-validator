import Nope from '..';

describe('#NopeBoolean', () => {
  describe('#true', () => {
    it('should return undefined for an empty entry', () => {
      expect(Nope.boolean().true().validate(undefined)).toBe(undefined);
    });

    it('should return an error message for a false entry', () => {
      expect(Nope.boolean().true('trueError').validate(false)).toBe('trueError');
    });

    it('should return undefined for a true entry', () => {
      expect(Nope.boolean().true().validate(true)).toBe(undefined);
    });
  });

  describe('#false', () => {
    it('should return undefined for an empty entry', () => {
      expect(Nope.boolean().false().validate(undefined)).toBe(undefined);
    });

    it('should return an error message for a true entry', () => {
      expect(Nope.boolean().false('falseError').validate(true)).toBe('falseError');
    });

    it('should return undefined for a false entry', () => {
      expect(Nope.boolean().false().validate(false)).toBe(undefined);
    });
  });
});
