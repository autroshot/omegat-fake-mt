import console from 'console';
import 'dotenv/config';
import express from 'express';
import { fetchTranslation as fetchDeepLTranslation } from './deepL';
import { fetchTranslation as fetchGoogleTranslation } from './google';
import { fetchTranslation as fetchNaverTranslation } from './naver';
import { NaverClient } from './types';
import { getRandomElement } from './utils/general';
import {
  convertApostropheHTMLCodeToText,
  convertTagToApostrophe,
} from './utils/text';

const app = express();
const port = 8877;

const naverClients = getNaverClients();

app.get('/', (req, res) => {
  const query = req.query;

  if (!isValidRequestQuery(query)) {
    res.status(400).send();
  } else {
    const text = query.text;
    const convertedText = convertTagToApostrophe(query.text);

    Promise.allSettled([
      fetchGoogleTranslation(text),
      fetchNaverTranslation(convertedText, getRandomElement(naverClients)),
      fetchDeepLTranslation(text),
    ]).then((promises) => {
      let googleResult = '';
      let naverResult = '';
      let deepLResult = '';
      const googlePromise = promises[0];
      const naverPromise = promises[1];
      const deepLPromise = promises[2];

      if (googlePromise.status === 'rejected') {
        googleResult = `${googlePromise.reason.response.status}: ${googlePromise.reason.response.statusText}
${googlePromise.reason.response.data.error.message}`;
      } else {
        const glossaryTranslatedText =
          googlePromise.value.data.glossaryTranslations[0].translatedText;
        const translatedText =
          googlePromise.value.data.translations[0].translatedText;

        const convertedGlossaryTranslatedText = convertApostropheHTMLCodeToText(
          glossaryTranslatedText
        );
        const convertedTranslatedText =
          convertApostropheHTMLCodeToText(translatedText);

        googleResult = `## 용어집 적용
${convertedGlossaryTranslatedText}

## 기본
${convertedTranslatedText}`;
      }

      if (naverPromise.status === 'rejected') {
        naverResult = `${naverPromise.reason.response.status}: ${naverPromise.reason.response.statusText}
${naverPromise.reason.response.data.errorCode}: ${naverPromise.reason.response.data.errorMessage}`;
      } else {
        naverResult = naverPromise.value.data.message.result.translatedText;
      }

      if (deepLPromise.status === 'rejected') {
        deepLResult = String(deepLPromise.reason);
      } else {
        deepLResult = deepLPromise.value.text;
      }

      const mergedResult = `# 구글 번역 v3
${googleResult}

# DeepL 번역
${deepLResult}

# 네이버 파파고 번역
${naverResult}`;

      res.status(200).send({
        translation: mergedResult,
      });
    });
  }

  function isValidRequestQuery(any: any): any is ValidRequestQuery {
    return (
      typeof any === 'object' &&
      !Array.isArray(any) &&
      any !== null &&
      any.source === 'EN-US' &&
      any.target === 'KO' &&
      typeof any.text === 'string'
    );
  }

  interface ValidRequestQuery {
    source: 'EN-US';
    target: 'KO';
    text: string;
  }
});

app.listen(port, () => {
  console.log(`Fake TM Server listening on port ${port}!`);
});

function getNaverClients(): NaverClient[] {
  const result: NaverClient[] = [];

  let i = 1;
  while (true) {
    const id = process.env[`NAVER_CLIENT_ID_${i}`];
    const secret = process.env[`NAVER_CLIENT_SECRET_${i}`];

    if (!id || !secret || i >= 50) break;

    result.push({ id, secret });
    i += 1;
  }

  return result;
}
