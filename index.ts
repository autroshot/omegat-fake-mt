import console from 'console';
import 'dotenv/config';
import express from 'express';
import axios from './node_modules/axios/index';
import qs from 'qs';
import { convertTagToSingleQuotationMarks } from './utils/text';

const app = express();
const port = 8877;

app.get('/', (req, res) => {
  const query = req.query;

  if (!isValidRequestQuery(query)) {
    res.status(400).send();
  } else {
    const convertedText = convertTagToSingleQuotationMarks(query.text);

    Promise.allSettled([
      fetchGoogleTranslation(convertedText),
      fetchNaverTranslation(convertedText),
    ]).then((promises) => {
      let googleResult = '';
      let naverResult = '';
      const googlePromise = promises[0];
      const naverPromise = promises[1];

      if (googlePromise.status === 'rejected') {
        googleResult = `${googlePromise.reason.response.status}: ${googlePromise.reason.response.statusText}
${googlePromise.reason.response.data.error.message}`;
      } else {
        googleResult =
          googlePromise.value.data.data.translations[0].translatedText;
      }

      if (naverPromise.status === 'rejected') {
        naverResult = `${naverPromise.reason.response.status}: ${naverPromise.reason.response.statusText}
${naverPromise.reason.response.data.errorCode}: ${naverPromise.reason.response.data.errorMessage}`;
      } else {
        naverResult = naverPromise.value.data.message.result.translatedText;
      }

      const mergedResult = `[구글 번역 v2]
${googleResult}

[네이버 파파고 번역]
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

  function fetchGoogleTranslation(text: string) {
    return axios<GoogleAPIResponseData>({
      method: 'post',
      url: 'https://translation.googleapis.com/language/translate/v2',
      params: {
        q: text,
        target: 'ko',
        format: 'text',
        source: 'en',
        model: 'base',
        key: process.env.GOOGLE_API_KEY,
      },
    });
  }

  function fetchNaverTranslation(text: string) {
    return axios<NaverAPIResponseData>({
      method: 'post',
      url: 'https://openapi.naver.com/v1/papago/n2mt',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
      },
      data: qs.stringify({
        source: 'en',
        target: 'ko',
        text: text,
      }),
    });
  }

  interface ValidRequestQuery {
    source: 'EN-US';
    target: 'KO';
    text: string;
  }

  interface GoogleAPIResponseData {
    data: {
      translations: Translation[];
    };
  }

  interface Translation {
    model: string;
    translatedText: string;
  }

  interface NaverAPIResponseData {
    message: {
      result: {
        srcLangType: 'ko';
        tarLangType: 'en';
        translatedText: string;
      };
    };
  }
});

app.listen(port, () => {
  console.log(`Fake TM Server listening on port ${port}!`);
});
