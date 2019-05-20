const config = require('../arsco-common/config');
const logger = require('../arsco-common/logger');

const morgan = require('morgan');
const express = require('express');

const authUser = require('./app/services/authService');



//////////////////////////////////////////////////////////////

const app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

app.get('/auth', authUser);

app.get('/getAuth', function (request, response) {
	response.redirect(config.instagram.auth_url);
});

app.get('/', function (request, response) {
	response.sendfile('./public/index.html');
});

app.listen(3000);

logger.info("아스코 auth 서버 3000번 포트에서 시작");