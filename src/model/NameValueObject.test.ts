import { NameValueObject } from './NameValueObject';

const isNameValueObject = (obj: any): obj is NameValueObject => {
  return (
    typeof obj.name === 'string' &&
    typeof obj.value === 'string'
  );
};

describe('NameValueObject Interface', () => {
  it('should validate a correct NameValueObject', () => {
    const validNameValueObject: NameValueObject = {
      name: 'exampleName',
      value: 'exampleValue'
    };

    expect(isNameValueObject(validNameValueObject)).toBe(true);
  });

  it('should invalidate an incorrect NameValueObject', () => {
    const invalidNameValueObject = {
      name: 'exampleName',
      value: 123
    };

    expect(isNameValueObject(invalidNameValueObject)).toBe(false);
  });

  it('should invalidate an object with missing properties', () => {
    const incompleteNameValueObject = {
      name: 'exampleName'
    };

    expect(isNameValueObject(incompleteNameValueObject)).toBe(false);
  });
});