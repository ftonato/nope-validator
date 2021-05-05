import Nope from '..';
import { validateSyncAndAsync } from './utils';

describe('#NopeBoolean', () => {
  describe('#true', () => {
    it('should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(Nope.boolean().true(), undefined, undefined);
    });

    it('should return an error message for a false entry', async () => {
      await validateSyncAndAsync(Nope.boolean().true('trueError'), false, 'trueError');
    });

    it('should return undefined for a true entry', async () => {
      await validateSyncAndAsync(Nope.boolean().true('trueError'), true, undefined);
    });
  });

  describe('#false', () => {
    it('should return undefined for an empty entry', async () => {
      await validateSyncAndAsync(Nope.boolean().false(), undefined, undefined);
    });

    it('should return an error message for a true entry', async () => {
      await validateSyncAndAsync(Nope.boolean().false('falseError'), true, 'falseError');
    });

    it('should return undefined for a false entry', async () => {
      await validateSyncAndAsync(Nope.boolean().false(), false, undefined);
    });
  });
});
