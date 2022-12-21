export default function toKebabCase(str: string): string {
  if (typeof str !== 'string')
    throw new TypeError('This function requires a string parameter');

  return str.replace(/\s/g, '-').toLowerCase();
}
