// Make sure you build the library before running this code

import bench from 'benny';
import { yupSchema, yupAsyncSchema, nopeSchema, entry, asyncEntry } from './schemas';

bench.suite(
  'Benchmark:: Nope validator',

  bench.add('nopeSync', () => {
    return nopeSchema.validate(entry);
  }),

  bench.add('yupSync', () => {
    try {
      return yupSchema.validateSync(entry);
    } catch (_) {}
  }),

  bench.add('yupAsync', async () => {
    try {
      return await yupAsyncSchema.validate(asyncEntry);
    } catch (_) {}
  }),

  bench.cycle(),
  bench.complete(),
);
