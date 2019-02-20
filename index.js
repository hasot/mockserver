const cors = require('cors');
const express = require('express');
const http = require('http');
const https = require('https');
const url = require('url');

let app = express();
app.use(cors());
app.options('*', cors());


const port = 3000;

const server = http.createServer((request, response) => {

  let headers = {};
  let reqHeaders = request.headers;
  if (reqHeaders.hasOwnProperty("authorization")) {
    headers['authorization'] = reqHeaders['authorization'];
  }
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  if(request.method === 'OPTIONS' ) {
    response.end('OK');
  } else {
    const options = {
      hostname: 'example.com',
      path: request.url,
      method: request.method,
      headers:  headers
    }
    const proxy = https.request(options, function (res) {
    res.pipe(response, {
      end: true
    });
  });
  request.pipe(proxy, {
    end: true
  });
}
});

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});
