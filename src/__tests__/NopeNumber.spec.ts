import Nope from '..';
import { validateSyncAndAsync } from './utils';

describe('#NopeNumber', () => {
  describe('#min', () => {
    it('(alias for greaterThan) should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(
        Nope.number().min(3, 'minLengthErrorMessage'),
        undefined,
        undefined,
      );
    });

    it('(alias for greaterThan) should return an error message for an entry smaller than the threshold', async () => {
      await validateSyncAndAsync(Nope.number().min(5, 'tooSmall'), 2, 'tooSmall');
    });

    it('(alias for greaterThan) should return an error message for an entry equal to the threshold', async () => {
      await validateSyncAndAsync(Nope.number().min(3, 'tooSmall'), 3, 'tooSmall');
    });

    it('(alias for greaterThan) should return undefined for an entry greater than the threshold', async () => {
      await validateSyncAndAsync(Nope.number().min(5, 'minLengthErrorMessage'), 6, undefined);
    });
  });

  describe('#max', () => {
    it('(alias for lessThan) should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(
        Nope.number().max(5, 'maxLengthErrorMessage'),
        undefined,
        undefined,
      );
    });

    it('(alias for lessThan) should return an error message for an entry greater than the threshold', async () => {
      await validateSyncAndAsync(Nope.number().max(5, 'tooLarge'), 7, 'tooLarge');
    });

    it('(alias for lessThan) should return an error message for an entry equal to the threshold', async () => {
      await validateSyncAndAsync(Nope.number().max(4, 'maxLength'), 4, 'maxLength');
    });

    it('(alias for lessThan) should return undefined for an entry smaller than the threshold', async () => {
      await validateSyncAndAsync(Nope.number().max(5, 'maxLength'), 2, undefined);
    });
  });

  describe('#greaterThan', () => {
    it('should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(
        Nope.number().greaterThan(5, 'greaterThanErrorMessage'),
        undefined,
        undefined,
      );
    });

    it('should return an error message for an entry smaller than the threshold', async () => {
      await validateSyncAndAsync(Nope.number().greaterThan(5, 'tooSmall'), 2, 'tooSmall');
    });

    it('should return an error message for an entry equal to the threshold', async () => {
      await validateSyncAndAsync(Nope.number().greaterThan(3, 'tooSmall'), 3, 'tooSmall');
    });

    it('should return undefined for an entry greater than the threshold', async () => {
      await validateSyncAndAsync(
        Nope.number().greaterThan(5, 'greaterThanErrorMessage'),
        6,
        undefined,
      );
    });
  });

  describe('#lessThan', () => {
    it('should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(
        Nope.number().lessThan(5, 'lessThanErrorMessage'),
        undefined,
        undefined,
      );
    });

    it('should return an error message for an entry greater than the threshold', async () => {
      await validateSyncAndAsync(Nope.number().lessThan(5, 'tooLarge'), 7, 'tooLarge');
    });

    it('should return an error message for an entry equal to the threshold', async () => {
      await validateSyncAndAsync(Nope.number().lessThan(4, 'tooLarge'), 6, 'tooLarge');
    });

    it('should return undefined for an entry smaller than the threshold', async () => {
      await validateSyncAndAsync(Nope.number().lessThan(5, 'lessThanErrorMessage'), 2, undefined);
    });
  });

  describe('#atLeast', () => {
    it('should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(
        Nope.number().atLeast(5, 'atLeastErrorMessage'),
        undefined,
        undefined,
      );
    });

    it('should return an error message for an entry smaller than the the threshold', async () => {
      await validateSyncAndAsync(Nope.number().atLeast(5, 'tooSmall'), 2, 'tooSmall');
    });

    it('should return undefined for an entry equal to the threshold', async () => {
      await validateSyncAndAsync(Nope.number().atLeast(3, 'atLeastErrorMessage'), 3, undefined);
    });

    it('should return undefined for an entry greater than the threshold', async () => {
      await validateSyncAndAsync(Nope.number().atLeast(5, 'atLeastErrorMessage'), 6, undefined);
    });
  });

  describe('#atMost', () => {
    it('should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(
        Nope.number().atMost(5, 'atMostErrorMessage'),
        undefined,
        undefined,
      );
    });

    it('should return an error message for an entry greater than the theshold', async () => {
      await validateSyncAndAsync(Nope.number().atMost(5, 'tooLarge'), 7, 'tooLarge');
    });

    it('should return undefined for an entry equal to the threshold', async () => {
      await validateSyncAndAsync(Nope.number().atMost(10, 'atMostErrorMessage'), 10, undefined);
    });

    it('should return undefined for an entry smaller than the threshold', async () => {
      await validateSyncAndAsync(Nope.number().atMost(5, 'atMostErrorMessage'), 2, undefined);
    });
  });

  describe('#positive', () => {
    it('should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(Nope.number().positive(), undefined, undefined);
    });

    it('should return an error message for an entry negative', async () => {
      await validateSyncAndAsync(Nope.number().positive('mustBePositive'), -1, 'mustBePositive');
    });

    it('should return undefined for an entry positive', async () => {
      await validateSyncAndAsync(Nope.number().positive('positiveErrorMessage'), 2, undefined);
    });
  });

  describe('#negative', () => {
    it('should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(Nope.number().negative(), undefined, undefined);
    });

    it('should return an error message for an entry negative', async () => {
      await validateSyncAndAsync(Nope.number().negative('mustBeNegative'), 1, 'mustBeNegative');
    });

    it('should return undefined for an entry negative', async () => {
      await validateSyncAndAsync(Nope.number().negative('negativeErrorMessage'), -1, undefined);
    });
  });

  describe('#integer', () => {
    it('should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(Nope.number().integer(), undefined, undefined);
    });

    it('should return an error message for an entry not an integer', async () => {
      await validateSyncAndAsync(Nope.number().integer('mustBeInteger'), 3.14, 'mustBeInteger');
    });

    it('should return undefined for an entry an integer', async () => {
      await validateSyncAndAsync(Nope.number().integer('integerErrorMessage'), 1, undefined);
    });
  });

  describe('#number', () => {
    it('should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(
        Nope.number('validNumberErrorMessage').required(),
        'integer',
        'validNumberErrorMessage',
      );
    });

    it('should return an error message for an entry not an integer', async () => {
      await validateSyncAndAsync(Nope.number('notValidNumber').integer(), 'one', 'notValidNumber');
    });

    it('should return undefined for a string entry of an integer', async () => {
      await validateSyncAndAsync(Nope.number().integer('integerErrorMessage'), '12', undefined);
    });
  });
});
