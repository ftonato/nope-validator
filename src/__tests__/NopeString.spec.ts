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
    it('(alias for atLeast) should return undefined for an empty entry', async () => {
      const schema = Nope.string().min(5, 'minLengthErrorMessage');

      await validateSyncAndAsync(schema, undefined, undefined);
    });

    it('(alias for atLeast) should return an error message for an entry shorter than the threshold', async () => {
      const schema = Nope.string().min(5);

      await validateSyncAndAsync(schema, 'tour', 'Input is too short');
    });

    it('(alias for atLeast) should return an error message for an entry shorter than the threshold', async () => {
      const schema = Nope.string().min(5);

      await validateSyncAndAsync(schema, 6, 'Input is too short');
    });

    it('(alias for atLeast) should return undefined for an entry equal to the threshold', async () => {
      const schema = Nope.string().min(4);

      await validateSyncAndAsync(schema, 'tour', undefined);
    });

    it('(alias for atLeast) should return undefined for an entry longer than the threshold', async () => {
      const schema = Nope.string().min(5, 'minLengthErrorMessage');

      await validateSyncAndAsync(schema, 'magicalmystery', undefined);
    });
  });

  describe('#max', () => {
    it('(alias for atMost) should return undefined for an empty entry', async () => {
      const schema = Nope.string().max(5, 'maxLengthErrorMessage');

      await validateSyncAndAsync(schema, undefined, undefined);
    });

    it('(alias for atMost) should return an error message for an entry longer than the threshold', async () => {
      const schema = Nope.string().max(5);

      await validateSyncAndAsync(schema, 'magicalmystery', 'Input is too long');
    });

    it('(alias for atMost) should return undefined for an entry equal to the threshold', async () => {
      const schema = Nope.string().max(14);

      await validateSyncAndAsync(schema, 'magicalmystery', undefined);
    });

    it('(alias for atMost) should return undefined for an entry shorter than threshold', async () => {
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

  describe('#uuid', () => {
    const v1 = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
    const v4 = '550e8400-e29b-41d4-a716-446655440000';
    const v5 = '886313e1-3b8a-5372-9b0d-44c7165d2345';

    it('should accept valid UUID v1', async () => {
      await validateSyncAndAsync(Nope.string().uuid(), v1, undefined);
    });

    it('should accept valid UUID v4', async () => {
      await validateSyncAndAsync(Nope.string().uuid(), v4, undefined);
    });

    it('should accept valid UUID v5', async () => {
      await validateSyncAndAsync(Nope.string().uuid(), v5, undefined);
    });

    it('should reject invalid UUID with wrong length', async () => {
      await validateSyncAndAsync(
        Nope.string().uuid(),
        '550e8400-e29b-41d4-a716-44665544000',
        'Input is not a valid UUID',
      );
      await validateSyncAndAsync(
        Nope.string().uuid(),
        '550e8400-e29b-41d4-a716-446655440000-extra',
        'Input is not a valid UUID',
      );
    });

    it('should reject invalid UUID with wrong characters', async () => {
      await validateSyncAndAsync(
        Nope.string().uuid(),
        '550e8400-e29b-41d4-zzzz-446655440000',
        'Input is not a valid UUID',
      );
    });

    it('should reject invalid UUID with missing hyphens', async () => {
      await validateSyncAndAsync(
        Nope.string().uuid(),
        '550e8400e29b41d4a716446655440000',
        'Input is not a valid UUID',
      );
    });

    it('should reject empty string when required', async () => {
      await validateSyncAndAsync(Nope.string().uuid().required(), '', 'This field is required');
    });

    it('should reject non-string values', async () => {
      await validateSyncAndAsync(Nope.string().uuid(), 12345, 'Input is not a valid UUID');
    });

    it('should support custom error messages', async () => {
      await validateSyncAndAsync(Nope.string().uuid('bad id'), 'not-a-uuid', 'bad id');
    });

    it('should allow optional UUID fields', async () => {
      await validateSyncAndAsync(Nope.string().uuid().optional(), undefined, undefined);
    });

    it('should require UUID fields when required()', async () => {
      await validateSyncAndAsync(
        Nope.string().uuid().required(),
        undefined,
        'This field is required',
      );
    });
  });

  describe('#length', () => {
    it('should accept a string with exact expected length', async () => {
      await validateSyncAndAsync(Nope.string().length(5), 'hello', undefined);
    });

    it('should reject a string shorter than expected length', async () => {
      await validateSyncAndAsync(Nope.string().length(5), 'hi', 'Must be at exactly of length 5');
    });

    it('should reject a string longer than expected length', async () => {
      await validateSyncAndAsync(
        Nope.string().length(5),
        'hello!',
        'Must be at exactly of length 5',
      );
    });

    it('should accept empty string with expected length 0', async () => {
      await validateSyncAndAsync(Nope.string().length(0), '', undefined);
    });

    it('should reject empty string with expected length greater than 0', async () => {
      await validateSyncAndAsync(Nope.string().length(3), '', 'Must be at exactly of length 3');
    });

    it('should coerce non-string values before checking length', async () => {
      await validateSyncAndAsync(Nope.string().length(3), 123, undefined);
    });

    it('should support custom error messages', async () => {
      await validateSyncAndAsync(Nope.string().length(5, 'wrong size'), 'hi', 'wrong size');
    });

    it('should behave the same as exactLength()', async () => {
      const lengthSchema = Nope.string().length(5, 'msg');
      const exactLengthSchema = Nope.string().exactLength(5, 'msg');

      for (const value of [undefined, 'hello', 'hi', 'hello!']) {
        expect(lengthSchema.validate(value)).toEqual(exactLengthSchema.validate(value));
      }
    });
  });

  describe('#trim', () => {
    it('should remove the whitespace from the entry and return undefined [email]', async () => {
      const ERR_MSG = 'error-message';
      const schema = Nope.string().trim().email(ERR_MSG);

      for (const { value, expected } of [
        { value: ' ftonato@example.com ', expected: undefined },
        { value: ' ftonato@example.io', expected: undefined },
        { value: 'ftonato@example.me ', expected: undefined },
        { value: 'ftonato@example.me', expected: undefined },
      ]) {
        await validateSyncAndAsync(schema, value, expected);
      }
    });

    it('should remove the whitespace from the entry and return undefined [required]', async () => {
      const schema = Nope.string().trim().required('requiredMessage');

      for (const { value, expected } of [
        { value: ' space-text-space ', expected: undefined },
        { value: ' space-text', expected: undefined },
        { value: 'text-space ', expected: undefined },
        { value: 'text', expected: undefined },
      ]) {
        await validateSyncAndAsync(schema, value, expected);
      }
    });
  });
});
