const LOGGER = require('../../arsco-common/logger');

const express = require('express');
const path = require('path');
const ejs = require('ejs');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api/api');
const adminRouter = require('./routes/admin/admin');

const app = express();

const accessDB = require('../../arsco-common/db/accessDB');

accessDB.connect();

/*
 * express 설정
 */

// session 설정
app.use(
  session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true,
  }),
);

// body parser 설정
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/', apiRouter);
app.use('/admin/', adminRouter);

// 404
app.use((req, res, next) => {
  res.status(404).send('일치하는 주소가 없습니다!');
});

// ERROR
app.use(function(err, req, res, next) {
  res.json({ message: err });
});

try {
  app.listen(3001);
  LOGGER.info('아스코 뷰 서버 3001번 포트에서 시작');
} catch (error) {
  console.log(error);
}
