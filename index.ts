import express from 'express';
import { convertTagToSingleQuotationMarks } from './utils/text';

const app = express();
const port = 8877;

app.get('/', (req, res) => {
  console.log('%s %s', req.method, req.url);

  let translatedText = '';
  let text = req.query.text as string;

  // Do something more useful here...
  translatedText =
    req.query.source +
    '>' +
    req.query.target +
    ' => [' +
    convertTagToSingleQuotationMarks(text) +
    ']';

  res.status(200).send({ translation: translatedText });
});

app.listen(port, () => {
  console.log(`Fake TM Server listening on port ${port}!`);
});
