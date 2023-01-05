import 'dotenv/config';
import express from 'express';
import axios from './node_modules/axios/index';
import { convertTagToSingleQuotationMarks } from './utils/text';

const app = express();
const port = 8877;

app.get('/', (req, res) => {
  console.log('%s %s', req.method, req.url);
  const query = req.query;
  if (!isValidRequestQuery(query)) {
    res.status(400).send();
  } else {
    axios({
      method: 'post',
      url: 'https://translation.googleapis.com/language/translate/v2',
      params: {
        q: convertTagToSingleQuotationMarks(query.text),
        target: 'ko',
        format: 'text',
        source: 'en',
        model: 'base',
        key: process.env.GOOGLE_TRANSLATE_KEY,
      },
    })
      .then((axiosResponse) => {
        res.status(200).send({
          translation: axiosResponse.data.data.translations[0].translatedText,
        });
      })
      .catch((axiosError) => {
        res.status(axiosError.response.status).send();
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
