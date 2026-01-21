const isString = (value: unknown): value is string =>
  typeof value === 'string';

export const asString = (value: unknown): string => (isString(value) ? value : '');

export const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter(isString) : [];
