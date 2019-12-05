require('module-alias/register');
const CONFIG = require('@Common/config');
const LOGGER = require('@Common/logger');

const express = require('express');

const authUser = require('./app/services/authService');

//////////////////////////////////////////////////////////////

const app = express();

app.get('/auth', authUser);
app.get('/getAuth', function(request, response) {
  response.redirect(CONFIG.instagram.auth_url);
});
app.get('/', function(request, response) {
  response.sendfile('./public/index.html');
});

try {
  app.listen(3000);
  LOGGER.info('아스코 권한 서버 3000번 포트에서 시작');
} catch (error) {
  console.log(error);
}
