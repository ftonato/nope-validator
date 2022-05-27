import Nope from '..';
import { validateSyncAndAsync } from './utils';

describe('#NopeString', () => {
  describe('#regex', () => {
    it('should return undefined for an empty entry', async () => {
      const schema = Nope.string().regex(/abc/i, 'urlErrorMessage');
      await validateSyncAndAsync(schema, undefined, undefined);
    });

    it('should return an error message for an invalid entry', async () => {
      const schema = Nope.string().regex(/abc/i, 'errorMessage');
      await validateSyncAndAsync(schema, 'defg', 'errorMessage');
    });

    it('should return undefined for an valid entry', async () => {
      const schema = Nope.string().regex(/abc/i);
      await validateSyncAndAsync(schema, 'abc', undefined);
    });
  });

  describe('#url', () => {
    it('should return undefined for an empty entry', async () => {
      const schema = Nope.string().url('urlErrorMessage');
      await validateSyncAndAsync(schema, undefined, undefined);
    });

    it('should return an error message for an invalid URL', async () => {
      const invalidUrls = ['http://:google.com', 'http://', 'http://foo.bar/foo(bar)baz quux'];
      const schema = Nope.string().url('urlErrorMessage');
      for (const url of invalidUrls) {
        await validateSyncAndAsync(schema, url, 'urlErrorMessage');
      }
    });

    it('should return undefined for an valid URL', async () => {
      const validUrls = [
        'https://github.com/bvego/nope-validator/commit/4564b7444dcd92769e5c5b80420469c9f18b7a05?branch=4564b7444dcd92769e5c5b80420469c9f18b7a05&diff=split',
        'https://google.com',
        'https://google.com?asd=123',
        'https://google.com/123',
        'https://google.com/123/456?q=42',
      ];

      const schema = Nope.string().url('urlErrorMessage');
      for (const url of validUrls) {
        await validateSyncAndAsync(schema, url, undefined);
      }
    });
  });

  describe('#email', () => {
    it('should return undefined for an empty entry', async () => {
      const schema = Nope.string().email('emailErrorMessage');
      await validateSyncAndAsync(schema, undefined, undefined);
    });

    it('should return an error message for an invalid email', async () => {
      const ERR_MSG = 'err';
      const schema = Nope.string().email(ERR_MSG);

      for (const mail of ['bruno.vegogmail.com', 'bruno.vego.gmail.com', 'bruno.vego@gmail.com@']) {
        await validateSyncAndAsync(schema, mail, ERR_MSG);
      }
    });

    it('should return undefined for an valid email', async () => {
      const ERR_MSG = 'err';
      const schema = Nope.string().email(ERR_MSG);
      for (const mail of [
        'bruno.vego@gmail.com',
        'random-guy@google.com',
        'random-guy+test@google.com',
      ]) {
        await validateSyncAndAsync(schema, mail, undefined);
      }
    });
  });

  describe('#min', () => {
    it('(alias for greaterThan) should return undefined for an empty entry', async () => {
      const schema = Nope.string().min(5, 'minLengthErrorMessage');

      await validateSyncAndAsync(schema, undefined, undefined);
    });

    it('(alias for greaterThan) should return an error message for an entry shorter than the the threshold', async () => {
      const schema = Nope.string().min(5);

      await validateSyncAndAsync(schema, 'tour', 'Input is too short');
    });

    it('(alias for greaterThan) should return an error message for an entry shorter than the the threshold', async () => {
      const schema = Nope.string().min(5);

      await validateSyncAndAsync(schema, 6, 'Input is too short');
    });

    it('(alias for greaterThan) should return an error message for an entry equal to the threshold', async () => {
      const schema = Nope.string().min(4);

      await validateSyncAndAsync(schema, 'tour', 'Input is too short');
    });

    it('(alias for greaterThan) should return undefined for an entry longer than the threshold', async () => {
      const schema = Nope.string().min(5, 'minLengthErrorMessage');

      await validateSyncAndAsync(schema, 'magicalmystery', undefined);
    });
  });

  describe('#max', () => {
    it('(alias for lessThan) should return undefined for an empty entry', async () => {
      const schema = Nope.string().max(5, 'maxLengthErrorMessage');

      await validateSyncAndAsync(schema, undefined, undefined);
    });

    it('(alias for lessThan) should return an error message for an entry longer than the the threshold', async () => {
      const schema = Nope.string().max(5);

      await validateSyncAndAsync(schema, 'magicalmystery', 'Input is too long');
    });

    it('(alias for lessThan) should return an error message for an entry equal to the threshold', async () => {
      const schema = Nope.string().max(14);

      await validateSyncAndAsync(schema, 'magicalmystery', 'Input is too long');
    });

    it('(alias for lessThan) should return undefined for an entry shorter than threshold', async () => {
      const schema = Nope.string().max(5, 'maxLengthErrorMessage');

      await validateSyncAndAsync(schema, 'tour', undefined);
    });
  });

  describe('#greaterThan', () => {
    it('should return undefined for an empty entry', async () => {
      const schema = Nope.string().greaterThan(5, 'greaterThanErrorMessage');
      await validateSyncAndAsync(schema, undefined, undefined);
    });

    it('should return an error message for an entry shorter than the threshold', async () => {
      const schema = Nope.string().greaterThan(5);
      await validateSyncAndAsync(schema, 'tour', 'Input is too short');
    });

    it('should return an error message for an entry equal to the threshold', async () => {
      const schema = Nope.string().greaterThan(4);
      await validateSyncAndAsync(schema, 'tour', 'Input is too short');
    });

    it('should return undefined for an entry longer than the threshold', async () => {
      const schema = Nope.string().greaterThan(5, 'greaterThanErrorMessage');
      await validateSyncAndAsync(schema, 'magicalmystery', undefined);
    });
  });

  describe('#lessThan', () => {
    it('should return undefined for an empty entry', async () => {
      const schema = Nope.string().lessThan(5, 'lessThanErrorMessage');

      await validateSyncAndAsync(schema, undefined, undefined);
    });

    it('should return an error message for an entry longer than the threshold', async () => {
      const schema = Nope.string().lessThan(5);

      await validateSyncAndAsync(schema, 'magicalmystery', 'Input is too long');
    });

    it('should return an error message for an entry equal to the threshold', async () => {
      const schema = Nope.string().lessThan(14);

      await validateSyncAndAsync(schema, 'magicalmystery', 'Input is too long');
    });

    it('should return undefined for an entry shorter than threshold', async () => {
      const schema = Nope.string().lessThan(5, 'lessThanErrorMessage');

      await validateSyncAndAsync(schema, 'tour', undefined);
    });
  });

  describe('#atLeast', () => {
    it('should return undefined for an empty entry', async () => {
      const schema = Nope.string().atLeast(5, 'atLeastErrorMessage');
      await validateSyncAndAsync(schema, undefined, undefined);
    });

    it('should return an error message for an entry shorter than the threshold', async () => {
      const schema = Nope.string().atLeast(5);
      await validateSyncAndAsync(schema, 'tour', 'Input is too short');
    });

    it('should return undefined for an entry equal to the threshold', async () => {
      const schema = Nope.string().atLeast(4, 'atLeastErrorMessage');
      await validateSyncAndAsync(schema, 'tour', undefined);
    });

    it('should return undefined for an entry longer than the threshold', async () => {
      const schema = Nope.string().atLeast(5, 'atLeastErrorMessage');
      await validateSyncAndAsync(schema, 'magicalmystery', undefined);
    });
  });

  describe('#atMost', () => {
    it('should return undefined for an empty entry', async () => {
      const schema = Nope.string().atMost(5, 'atMostErrorMessage');
      await validateSyncAndAsync(schema, undefined, undefined);
    });

    it('should return an error message for an entry longer than the threshold', async () => {
      const schema = Nope.string().atMost(5);
      await validateSyncAndAsync(schema, 'magicalmystery', 'Input is too long');
    });

    it('should return undefined for an entry equal to the threshold', async () => {
      const schema = Nope.string().atMost(4, 'atMostErrorMessage');
      await validateSyncAndAsync(schema, 'tour', undefined);
    });

    it('should return undefined for an entry shorter than threshold', async () => {
      const schema = Nope.string().atMost(5, 'atMostErrorMessage');
      await validateSyncAndAsync(schema, 'tour', undefined);
    });
  });

  describe('#between', () => {
    it('should return undefined for an empty entry', async () => {
      const schema = Nope.string().between(5, 10, 'atLeastErrorMessage', 'atMostErrorMessage');
      await validateSyncAndAsync(schema, undefined, undefined);
    });

    it('should return an error message for an entry shorter than the threshold', async () => {
      const schema = Nope.string().between(5, 10);
      await validateSyncAndAsync(schema, 'tour', 'Input is too short');
    });

    it('should return undefined for an entry equal (startLength) to the threshold', async () => {
      const schema = Nope.string().between(4, 10);
      await validateSyncAndAsync(schema, 'tour', undefined);
    });

    it('should return undefined for an entry equal (endLength) to the threshold', async () => {
      const schema = Nope.string().between(4, 10);
      await validateSyncAndAsync(schema, '1234567890', undefined);
    });

    it('should return an error message for an entry longer than the threshold', async () => {
      const schema = Nope.string().between(5, 6);
      await validateSyncAndAsync(schema, 'magicalmystery', 'Input is too long');
    });

    it('should return undefined for both equal entries to the threshold', async () => {
      const schema = Nope.string().between(5, 5);
      await validateSyncAndAsync(schema, 'seven', undefined);
    });

    it('should throw an error if used wrongly', () => {
      const schema = Nope.string().between(5, 1);

      expect(() => {
        schema.validate('John Doe');
      }).toThrowError();
    });
  });

  describe('#required', () => {
    it('should return requiredMessage for undefined', async () => {
      const schema = Nope.string().required('requiredMessage');
      await validateSyncAndAsync(schema, undefined, 'requiredMessage');
    });

    it('should return requiredMessage for null', async () => {
      const schema = Nope.string().required('requiredMessage');
      await validateSyncAndAsync(schema, null, 'requiredMessage');
    });

    it('should return requiredMessage for empty string', async () => {
      const schema = Nope.string().required('requiredMessage');
      await validateSyncAndAsync(schema, '', 'requiredMessage');
    });

    it('should return requiredMessage for a string full of white spaces', async () => {
      const schema = Nope.string().required('requiredMessage');
      await validateSyncAndAsync(schema, '     ', 'requiredMessage');
    });
  });

  describe('#exactLength', () => {
    it('should return work', async () => {
      await validateSyncAndAsync(Nope.string().exactLength(5, 'msg'), undefined, undefined);
      await validateSyncAndAsync(Nope.string().exactLength(5, 'msg'), '123', 'msg');
      await validateSyncAndAsync(Nope.string().exactLength(5, 'msg'), '123456', 'msg');
      await validateSyncAndAsync(Nope.string().exactLength(5, 'msg'), 'lucky', undefined);
    });
  });

  describe('#trim', () => {
    it('should return a String wihtout whitespace [email]', async () => {
      const ERR_MSG = 'error-message';
      const schema = Nope.string().trim().email(ERR_MSG);

      for (const { value, expected } of [
        { value: ' ftonato@example.com ', expected: 'ftonato@example.com' },
        { value: ' ftonato@example.io', expected: 'ftonato@example.io' },
        { value: 'ftonato@example.me ', expected: 'ftonato@example.me' },
      ]) {
        await validateSyncAndAsync(schema, value, expected);
      }
    });

    it('should return a String wihtout whitespace [required]', async () => {
      const schema = Nope.string().trim().required('requiredMessage');

      for (const { value, expected } of [
        { value: ' ftonato ', expected: 'ftonato' },
        { value: ' ftonato', expected: 'ftonato' },
        { value: 'ftonato ', expected: 'ftonato' },
      ]) {
        await validateSyncAndAsync(schema, value, expected);
      }
    });
  });

  describe('#default', () => {
    it('should return a default value when entry is empty', async () => {
      const ERR_MSG = 'error-message';

      for (const { schema, value, expected } of [
        {
          schema: Nope.string().default('default-value').email(ERR_MSG),
          value: '',
          expected: 'default-value',
        },
        {
          schema: Nope.string().default('default-value-trim').trim().email(ERR_MSG),
          value: ' ',
          expected: 'default-value-trim',
        },
        {
          schema: Nope.string().default('_ftonato ').email(ERR_MSG),
          value: undefined,
          expected: '_ftonato ',
        },
        {
          schema: Nope.string().trim().default('will-not-assume-this-value').email(ERR_MSG),
          value: ' aaa ',
          expected: 'aaa',
        },
      ]) {
        await validateSyncAndAsync(schema, value, expected);
      }
    });
  });
});
