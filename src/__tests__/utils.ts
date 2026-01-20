export const validateSyncAndAsync = async (schema: any, value: any, result: any) => {
  expect(schema.validate(value)).toEqual(result);
  expect(await schema.validateAsync(value)).toEqual(result);
};
