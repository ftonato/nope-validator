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

  describe('#notOneOf', () => {
    let errorMessage: string;

    beforeAll(() => {
      errorMessage = 'shouldNotMatch';
    });

    it('should return undefined for a non-matching entry', () => {
      const validator = new Dummy().notOneOf(['a', 'b']);

      expect(validator.validate('c')).toEqual(undefined);
    });

    it('should return an error messsage when an entry matches', () => {
      const validator = new Dummy().notOneOf(['a', 'b'], errorMessage);

      expect(validator.validate('b')).toEqual(errorMessage);
    });

    describe('reference tests', () => {
      it('should return undefined when references do not match', () => {
        const validator = Nope.object().shape({
          key1: Nope.string(),
          key2: Nope.string().notOneOf([Nope.ref('key1')]),
        });

        expect(
          validator.validate({
            key1: 'a',
            key2: 'b',
          }),
        ).toBeUndefined();
      });

      it('should return an error message when references match', () => {
        const validator = Nope.object().shape({
          key1: Nope.string(),
          key2: Nope.string().notOneOf([Nope.ref('key1')], errorMessage),
        });

        expect(
          validator.validate({
            key1: 'a',
            key2: 'a',
          }),
        ).toEqual({
          key2: errorMessage,
        });
      });

      it('should return the error message when there is a non-reference match', () => {
        const validator = Nope.object().shape({
          key1: Nope.string(),
          key2: Nope.string().notOneOf([Nope.ref('key1'), 'b', 'c'], errorMessage),
        });

        expect(
          validator.validate({
            key1: 'a',
            key2: 'c',
          }),
        ).toEqual({
          key2: errorMessage,
        });
      });
    });
  });

  describe('#test', () => {
    it('should return undefined for a valid value', () => {
      const validator = new Dummy()
        .test((entry) => {
          if (entry !== '42') {
            return '42Error';
          }
        })
        .required();

      expect(validator.validate('42')).toEqual(undefined);
    });

    it('should return the error message for an ivalid value', () => {
      const validator = new Dummy()
        .test((entry) => {
          if (entry !== '42') {
            return '42Error';
          }
        })
        .required();

      expect(validator.validate('41')).toEqual('42Error');
    });
  });

  describe('#when', () => {
    it('should work with simple boolean keys', () => {
      const schema = Nope.object().shape({
        small: Nope.boolean().required(),
        test: Nope.number().when('small', {
          is: true,
          then: Nope.number().max(2, 'should be small'),
          otherwise: Nope.number().min(2, 'should be big'),
        }),
      });

      expect(
        schema.validate({
          small: true,
          test: 3,
        }),
      ).toEqual({
        test: 'should be small',
      });

      expect(
        schema.validate({
          small: false,
          test: 1,
        }),
      ).toEqual({
        test: 'should be big',
      });

      expect(
        schema.validate({
          small: false,
          test: 5,
        }),
      ).toEqual(undefined);
    });

    it('should work with multiple boolean keys', () => {
      const schema = Nope.object().shape({
        small: Nope.boolean().required(),
        positive: Nope.boolean().required(),
        test: Nope.number().when(['small', 'positive'], {
          is: true,
          then: Nope.number().max(2, 'should be small').positive(),
          otherwise: Nope.number().min(2, 'should be big').negative('should be negative'),
        }),
      });

      expect(
        schema.validate({
          small: true,
          positive: false,
          test: 3,
        }),
      ).toEqual({
        test: 'should be negative',
      });

      expect(
        schema.validate({
          small: false,
          positive: true,
          test: 3,
        }),
      ).toEqual({
        test: 'should be negative',
      });

      expect(
        schema.validate({
          small: true,
          positive: true,
          test: 3,
        }),
      ).toEqual({
        test: 'should be small',
      });

      expect(
        schema.validate({
          small: true,
          positive: true,
          test: 1,
        }),
      ).toEqual(undefined);
    });

    it('should work with a predicate', () => {
      const schema = Nope.object().shape({
        small: Nope.boolean().required(),
        test: Nope.number().when(['small'], {
          is: true,
          then: Nope.number().max(2, 'should be small'),
          otherwise: Nope.number().min(2, 'should be big'),
        }),
      });

      expect(
        schema.validate({
          small: true,
          test: 3,
        }),
      ).toEqual({
        test: 'should be small',
      });

      expect(
        schema.validate({
          small: false,
          test: 1,
        }),
      ).toEqual({
        test: 'should be big',
      });

      expect(
        schema.validate({
          small: true,
          test: 1,
        }),
      ).toEqual(undefined);
    });

    it('should work with a predicate and multiple conditions', () => {
      const schema = Nope.object().shape({
        num: Nope.number().required(),
        num2: Nope.number().required(),
        test: Nope.number().when(['num', 'num2'], {
          is: (num, num2) => num === 42 || num2 === 42,
          then: Nope.number().max(2, 'should be small'),
          otherwise: Nope.number().min(2, 'should be big'),
        }),
      });

      expect(
        schema.validate({
          num: 42,
          num2: 43,
          test: 3,
        }),
      ).toEqual({
        test: 'should be small',
      });

      expect(
        schema.validate({
          num: 41,
          num2: 42,
          test: 3,
        }),
      ).toEqual({
        test: 'should be small',
      });

      expect(
        schema.validate({
          num: 41,
          num2: 41,
          test: 3,
        }),
      ).toEqual(undefined);

      expect(
        schema.validate({
          num: 41,
          num2: 41,
          test: 1,
        }),
      ).toEqual({
        test: 'should be big',
      });

      expect(
        schema.validate({
          num: 42,
          num2: 42,
          test: 1,
        }),
      ).toEqual(undefined);
    });

    it('should validate circulate referencing fields', () => {
      const schema = Nope.object().shape({
        name: Nope.string().required(),
        pdf: Nope.string().when('csv', {
          is: (csv) => !!csv,
          then: Nope.string(),
          otherwise: Nope.string().required(),
        }),
        csv: Nope.string().when('pdf', {
          is: (pdf) => !!pdf,
          then: Nope.string(),
          otherwise: Nope.string().required(),
        }),
      });

      expect(
        schema.validate({
          name: 'a',
        }),
      ).toEqual({
        csv: 'This field is required',
        pdf: 'This field is required',
      });

      expect(
        schema.validate({
          name: 'a',
          csv: 'test',
        }),
      ).toBeUndefined();

      expect(
        schema.validate({
          name: 'a',
          pdf: 'test',
        }),
      ).toBeUndefined();
    });
  });
});
