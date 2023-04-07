export function convertTagToApostrophe(text: string): string {
  return text.replace(/<\/?[a-z]\d+\/?>/g, `'`);
}

export function convertApostropheHTMLCodeToText(text: string): string {
  return text.replace(/&#39;/g, `'`);
}
