import Nope from '..';

describe('#NopeObject', () => {
  describe('#extend', () => {
    it('should extend the schema correctly', () => {
      const schema1 = Nope.object().shape({
        name: Nope.string().min(5, 'minNameMessage'),
        password: Nope.string().min(4, 'minPWMessage'),
      });

      const schema2 = Nope.object().extend(schema1);

      expect(
        schema2.validate({
          name: 'test',
          password: 'magic',
        }),
      ).toEqual({
        name: 'minNameMessage',
      });
    });

    it('should extend the schema correctly with own validators', () => {
      const schema1 = Nope.object().shape({
        name: Nope.string().min(5, 'minNameMessage'),
      });

      const schema2 = Nope.object()
        .extend(schema1)
        .shape({
          password: Nope.string().min(4, 'minPWMessage'),
        });

      expect(
        schema2.validate({
          name: 'magical',
          password: 'pw',
        }),
      ).toEqual({
        password: 'minPWMessage',
      });
    });

    it('should extend the schema correctly with own validators in reverse', () => {
      const schema1 = Nope.object().shape({
        name: Nope.string().min(5, 'minNameMessage'),
      });

      const schema2 = Nope.object()
        .shape({
          password: Nope.string().min(4, 'minPWMessage'),
        })
        .extend(schema1);

      expect(
        schema2.validate({
          name: 'magical',
          password: 'pw',
        }),
      ).toEqual({
        password: 'minPWMessage',
      });
    });

    it('should extend the schema correctly with own validators and references', () => {
      const schema1 = Nope.object().shape({
        password: Nope.string().min(5, 'minPwMessage'),
        password2: Nope.string().oneOf([Nope.ref('password')], 'pwMatchError'),
      });

      const schema2 = Nope.object()
        .extend(schema1)
        .shape({
          name: Nope.string().min(4, 'nameError'),
        });

      expect(
        schema2.validate({
          name: 'magical',
          password: 'password',
          password2: 'password2',
        }),
      ).toEqual({
        password2: 'pwMatchError',
      });
    });

    it('should extend the schema correctly with own validators and references in reverse', () => {
      const schema1 = Nope.object().shape({
        password: Nope.string().min(5, 'minPwMessage'),
        password2: Nope.string().oneOf([Nope.ref('password')], 'pwMatchError'),
      });

      const schema2 = Nope.object()
        .shape({
          name: Nope.string().min(4, 'nameError'),
        })
        .extend(schema1);

      expect(
        schema2.validate({
          name: 'magical',
          password: 'password',
          password2: 'password2',
        }),
      ).toEqual({
        password2: 'pwMatchError',
      });
    });
  });
});
