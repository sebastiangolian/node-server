const path = require('path');
const argv = require('yargs').argv;
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const url = '/api';
const mockDir = path.join(__dirname, 'api/');
app.use(express.static(path.join(__dirname, './api')));
app.use(bodyParser.json());
app.all(url + '/*', function (req, res) {
  console.log(req.path);
  let requestPath = req.path.substring(url.length).replace(/^\//, '');
  if (requestPath.lastIndexOf('GetCorrect') >= 0) {
    requestPath = `${requestPath}/${req.body.code}`;
  }
  if (requestPath.lastIndexOf('/') === requestPath.length - 1) {
    requestPath = requestPath.slice(0, -1);
  }
  //const method = req.method === 'GET' ? '' : `/${req.method.toLowerCase()}`;
  const method = `/${req.method.toLowerCase()}`;
  const filePath = mockDir + requestPath + `${method}.json`;
  console.log(filePath);
  if (!fs.existsSync(filePath)) {
    res.status(404);
    res.json();
    return;
  }
  const response = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  res.json(response);
});
app.listen(9090, function () {
  console.log('Example app listening on port 9090!');
});