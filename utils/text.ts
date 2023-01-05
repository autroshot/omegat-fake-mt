export function convertTagToSingleQuotationMarks(text: string): string {
  return text.replace(/<\/?[a-z]\d+\/?>/g, `'`);
}
