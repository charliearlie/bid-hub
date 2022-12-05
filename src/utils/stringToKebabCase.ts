export default function toKebabCase(str: string): string {
  console.log(str);
  if (typeof str !== 'string')
    throw new TypeError('This function requires a string parameter');

  const noSpaces = str.replace(/[\W\d_]/g, '');
  return [...noSpaces]
    .map((char, index) => {
      if (char === char.toUpperCase() && index !== 0) {
        return `-${char.toLowerCase()}`;
      } else {
        return char;
      }
    })
    .join('');
}
