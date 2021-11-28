require('module-alias/register');

const LOGGER = require('@Common/logger');

const cors = require('cors');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

// 404
app.use((req, res, next) => {
  res.status(404).send('일치하는 주소가 없습니다!');
});

// ERROR
app.use(function (err, req, res, next) {
  res.json({ message: err });
});

try {
  app.listen(3003);
  LOGGER.info('아스코 파일 서버 3003번 포트에서 시작');
} catch (error) {
  console.log(error);
}
