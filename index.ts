import express from 'express';

const app = express();
const port = 8877;

app.get('/', function (req, res) {
  console.log('%s %s', req.method, req.url);

  let text = req.query.text as string;

  // Do something more useful here...
  text =
    req.query.source +
    '>' +
    req.query.target +
    ' => [' +
    text.toUpperCase() +
    ']';

  res.status(200).send({ translation: text });
});

app.listen(port, function () {
  console.log(`Fake TM Server listening on port ${port}!`);
});
