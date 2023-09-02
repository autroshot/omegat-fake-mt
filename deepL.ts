import * as deepl from 'deepl-node';

function fetchTranslation(text: string): Promise<deepl.TextResult> {
  const AUTH_KEY = process.env.DEEP_L_AUTH_KEY;
  if (AUTH_KEY === undefined) {
    throw Error('필수 환경 변수인 DEEP_L_AUTH_KEY가 없습니다.');
  }

  const translator = new deepl.Translator(AUTH_KEY);
  return translator.translateText(text, 'en', 'ko', { tagHandling: 'xml' });
}

export { fetchTranslation };
