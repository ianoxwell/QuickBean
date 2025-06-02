export const sentenceCase = (sentence: string | undefined): string => {
  if (!sentence) {
    return '';
  }

  return sentence[0].toUpperCase() + sentence.substring(1).toLowerCase();
};

/** Generates random unique string from the list of characters - uppercase plus number or full upper and lowercase with numbers */
export const generateRandomUniqueString = (length: number, isUpperCaseOnly = true): string => {
  const characters = isUpperCaseOnly
    ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
};
