import { createSlug } from '.';

describe('kebabCase', () => {
  it('should replace capital letters in a string with "- and lower case"', () => {
    const str = 'Air force 1 pink';
    expect(createSlug(str)).toBe('air-force-1-pink');
  });

  it('should throw an error if a string is not provided', () => {
    // @ts-ignore
    expect(() => createSlug(5)).toThrowError(TypeError);
  });
});
