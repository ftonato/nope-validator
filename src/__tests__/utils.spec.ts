import * as utils from '../utils';

describe('#utils', () => {
  describe('#every', () => {
    it('should work', () => {
      expect(utils.every([3, 4, 5], (val) => val > 1)).toBe(true);
      expect(utils.every([true, true], (val) => val === true)).toBe(true);
      expect(utils.every([true, false], (val) => val === true)).toBe(false);
    });
  });

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
});
