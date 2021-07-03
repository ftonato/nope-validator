import * as utils from '../utils';

describe('#utils', () => {
  describe('#resolveNopeRefsFromKeys', () => {
    it('should work', () => {
      expect(utils.resolveNopeRefsFromKeys(['a', 'b', 'd'], { a: 2, b: 5 })).toEqual([
        2,
        5,
        undefined,
      ]);
    });
  });

  describe('#deepEquals', () => {
    it('should work', () => {
      expect(utils.deepEquals({ a: 42 }, { b: 42 })).toEqual(false);
      expect(utils.deepEquals({ a: [[42]] }, { a: [[42]] })).toEqual(true);
      expect(utils.deepEquals({ a: [[2, { a: 42 }]] }, { a: [[2, { a: 42 }]] })).toEqual(true);
      expect(utils.deepEquals({ a: [[2, { a: 42 }]] }, { a: [[2, { a: 41 }]] })).toEqual(false);
    });
  });

  describe('#getFromPath', () => {
    it('should work', () => {
      expect(utils.getFromPath('a.b.c', { a: { b: { c: 42 } } })).toBe(42);
      expect(utils.getFromPath('a.b.c[1].d', { a: { b: { c: [2, { d: 5 }] } } })).toBe(5);
    });
  });

  describe('#isNill alias for (null or undefined)', () => {
    it('should work', () => {
      expect(utils.isNil(null)).toBe(true);
      expect(utils.isNil(undefined)).toBe(true);
      expect(utils.isNil(666)).toBe(false);
      expect(utils.isNil('six')).toBe(false);
      expect(utils.isNil(true)).toBe(false);
      expect(utils.isNil({})).toBe(false);
      expect(utils.isNil([])).toBe(false);
      expect(utils.isNil(new Error())).toBe(false);
    });
  });

  describe('#pathToArray', () => {
    it('should work', () => {
      expect(utils.pathToArray('a.b.c')).toEqual(['a', 'b', 'c']);
      expect(utils.pathToArray('a.b.c[1].d')).toEqual(['a', 'b', 'c', '1', 'd']);
    });
  });
});
