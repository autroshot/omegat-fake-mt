import express from 'express';

const app = express();
const port = 8877;

app.get('/', function (req, res) {
  console.log('%s %s', req.method, req.url);

  let textToTranslate = req.query.text as string;

  // Do something more useful here...
  textToTranslate =
    req.query.source +
    '>' +
    req.query.target +
    ' => [' +
    textToTranslate.toUpperCase() +
    ']';

  res.status(200).send({ translation: textToTranslate });
});

app.listen(port, function () {
  console.log(`Fake TM Server listening on port ${port}!`);
});
