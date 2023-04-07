import console from 'console';
import 'dotenv/config';
import express from 'express';
import { JWT } from 'google-auth-library';
import qs from 'qs';
import axios from './node_modules/axios/index';
import { convertTagToSingleQuotationMarks } from './utils/text';

const app = express();
const port = 8877;

const naverClient: NaverClient[] = [];
for (let i = 1; i <= 5; i++) {
  const id = process.env[`NAVER_CLIENT_ID_${i}`];
  const secret = process.env[`NAVER_CLIENT_SECRET_${i}`];

  if (id && secret) {
    naverClient.push({ id, secret });
  }
}
let currentNaverClientIndex = 0;

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
          googlePromise.value.data.glossaryTranslations[0].translatedText;
        googleResult = `(용어집 적용)
${googlePromise.value.data.glossaryTranslations[0].translatedText}

(기본)
${googlePromise.value.data.translations[0].translatedText}`;
      }

      if (naverPromise.status === 'rejected') {
        naverResult = `${naverPromise.reason.response.status}: ${naverPromise.reason.response.statusText}
${naverPromise.reason.response.data.errorCode}: ${naverPromise.reason.response.data.errorMessage}`;
      } else {
        naverResult = naverPromise.value.data.message.result.translatedText;
      }

      const mergedResult = `[구글 번역 v3]
${googleResult}

[네이버 파파고 번역]
${naverResult}`;

      if (currentNaverClientIndex >= naverClient.length - 1) {
        currentNaverClientIndex = 0;
      }
      {
        currentNaverClientIndex += 1;
      }

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
    const JWTClient = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: String(process.env.GOOGLE_PRIVATE_KEY).replace(/\\n/gm, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/cloud-platform',
        'https://www.googleapis.com/auth/cloud-translation',
      ],
    });

    return JWTClient.request<GoogleAPIResponse>({
      url: `https://translate.googleapis.com/v3/projects/${process.env.GOOGLE_PROJECT_NUMBER}/locations/us-central1:translateText`,
      method: 'POST',
      data: createGoogleAPIRequestBody(),
    });

    function createGoogleAPIRequestBody() {
      return {
        contents: text,
        sourceLanguageCode: 'en',
        targetLanguageCode: 'ko',
        glossaryConfig: {
          glossary: `projects/${process.env.GOOGLE_PROJECT_NUMBER}/locations/us-central1/glossaries/${process.env.GOOGLE_GLOSSARY_ID}`,
        },
      };
    }
  }

  function fetchNaverTranslation(text: string) {
    return axios<NaverAPIResponseData>({
      method: 'post',
      url: 'https://openapi.naver.com/v1/papago/n2mt',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-Naver-Client-Id': naverClient[currentNaverClientIndex].id,
        'X-Naver-Client-Secret': naverClient[currentNaverClientIndex].secret,
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

  interface GoogleAPIResponse {
    translations: [
      {
        translatedText: string;
      }
    ];
    glossaryTranslations: [
      {
        translatedText: string;
        glossaryConfig: {
          glossary: string;
          ignoreCase: boolean;
        };
      }
    ];
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

interface NaverClient {
  id: string;
  secret: string;
}
