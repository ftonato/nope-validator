import Nope from '..';
import { validateSyncAndAsync } from './utils';

describe('#NopeDate', () => {
  describe('#before', () => {
    it('should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(Nope.date().before('2019-01-01'), undefined, undefined);
    });

    it('should return an error message for an invalid entry', async () => {
      await validateSyncAndAsync(
        Nope.date().before('2019-01-01', 'beforeError'),
        '2019-01-02',
        'beforeError',
      );
    });

    it('should return undefined for a valid entry', async () => {
      await validateSyncAndAsync(Nope.date().before('2019-01-02'), '2019-01-01', undefined);
    });
  });

  describe('#after', () => {
    it('should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(Nope.date().after('2019-01-01'), undefined, undefined);
    });

    it('should return an error message for an invalid entry', async () => {
      await validateSyncAndAsync(
        Nope.date().after('2019-01-02', 'afterError'),
        '2019-01-01',
        'afterError',
      );
    });

    it('should return undefined for a valid entry', async () => {
      await validateSyncAndAsync(
        Nope.date().after('2019-01-01', 'afterError'),
        '2019-01-02',
        undefined,
      );
    });
  });

  describe('#date', () => {
    it('should return notADate for an invalid date', async () => {
      await validateSyncAndAsync(
        Nope.date().after('2019-01-01'),
        'not a date',
        'The field is not a valid date',
      );
    });

    it('should return a defined error message for an invalid date', async () => {
      await validateSyncAndAsync(
        Nope.date('dateError').after('2019-01-02', 'afterError'),
        'not a date',
        'dateError',
      );
    });
  });
});
