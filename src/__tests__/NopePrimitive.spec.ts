import NopePrimitive from '../NopePrimitive';
import Nope from '..';

class Dummy extends NopePrimitive<string> {}

describe('#NopePrimitive', () => {
  describe('#required', () => {
    it('should return undefined for a non-nil entry', () => {
      const validator = new Dummy().required();

      expect(validator.validate('asd')).toEqual(undefined);
    });

    it('should return an error message for a nil entry', () => {
      const validator = new Dummy().required('requiredError');

      expect(validator.required().validate(undefined)).toEqual('requiredError');
      expect(validator.required().validate(null)).toEqual('requiredError');
    });
  });

  describe('#oneOf', () => {
    it('should return undefined for a non-nil entry', () => {
      const validator = new Dummy().oneOf(['a', 'b']);

      expect(validator.validate('a')).toEqual(undefined);
    });

    it('should return an error message for a invalid option', () => {
      const validator = new Dummy().oneOf(['a', 'b'], 'oneOfError');

      expect(validator.validate('c')).toEqual('oneOfError');
    });

    it('should resolve references correctly', () => {
      const validator1 = Nope.object().shape({
        test: Nope.string(),
        test2: Nope.string().oneOf([Nope.ref('test')]),
      });

      expect(
        validator1.validate({
          test: 'a',
          test2: 'a',
        }),
      ).toEqual(undefined);

      const validator2 = Nope.object().shape({
        test: Nope.string(),
        test2: Nope.string().oneOf([Nope.ref('test')], 'oneOfErr'),
      });

      expect(
        validator2.validate({
          test: 'a',
          test2: 'b',
        }),
      ).toEqual({
        test2: 'oneOfErr',
      });

      const validator3 = Nope.object().shape({
        test: Nope.string(),
        test2: Nope.string().oneOf([Nope.ref('test'), 'c'], 'oneOfErr'),
      });

      expect(
        validator3.validate({
          test: 'a',
          test2: 'c',
        }),
      ).toEqual(undefined);
    });
  });

  describe('#test', () => {
    it('should return undefined for a valid value', () => {
      const validator = new Dummy()
        .test(entry => {
          if (entry !== '42') {
            return '42Error';
          }
        })
        .required();

      expect(validator.validate('42')).toEqual(undefined);
    });

    it('should return the error message for an ivalid value', () => {
      const validator = new Dummy()
        .test(entry => {
          if (entry !== '42') {
            return '42Error';
          }
        })
        .required();

      expect(validator.validate('41')).toEqual('42Error');
    });
  });
});
