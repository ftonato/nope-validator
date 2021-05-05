export const validateSyncAndAsync = async (schema, value, result) => {
  expect(schema.validate(value)).toEqual(result);
  expect(await schema.validateAsync(value)).toEqual(result);
};
