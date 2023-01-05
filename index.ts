import 'dotenv/config';
import express from 'express';
import axios from './node_modules/axios/index';
import { convertTagToSingleQuotationMarks } from './utils/text';

const app = express();
const port = 8877;

app.get('/', (req, res) => {
  console.log('%s %s', req.method, req.url);

  let text = req.query.text as string;

  axios({
    method: 'post',
    url: 'https://translation.googleapis.com/language/translate/v2',
    params: {
      q: convertTagToSingleQuotationMarks(text),
      target: 'ko',
      format: 'text',
      source: 'en',
      model: 'base',
      key: process.env.GOOGLE_TRANSLATE_KEY,
    },
  })
    .then((axiosResponse) => {
      res
        .status(200)
        .send({
          translation: axiosResponse.data.data.translations[0].translatedText,
        });
    })
    .catch((axiosError) => {
      res.status(400);
    });
});

app.listen(port, () => {
  console.log(`Fake TM Server listening on port ${port}!`);
});
