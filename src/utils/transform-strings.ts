/**
 * Convert the given text to kebab-case.
 * @param text - the text to convert
 */
export const kebabCase = (text: string): string => {
  return text
    .split('')
    .map((letter, idx) => {
      return letter.toUpperCase() === letter
        ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
        : letter
    })
    .join('')
}
