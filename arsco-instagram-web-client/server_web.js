const logger = require('../arsco-common/logger');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var Ejs = require('ejs');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api/api');
var adminRouter = require('./routes/admin/admin');

var app = express();

// set session
app.use(session({
  secret: '@#@$MYSIGN#@$#$',
  resave: false,
  saveUninitialized: true
 }));

// set body parser
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', Ejs.renderFile);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/', apiRouter);
app.use('/admin/', adminRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => { // 404 처리 부분
  res.status(404).send('일치하는 주소가 없습니다!');
});

// error handler
app.use(function(err, req, res, next) {
  res.json({ message: err });
});

module.exports = app;

try {
  app.listen(3001);
  logger.info('아스코 뷰 서버 3001번 포트에서 시작')
} catch (error) {
  console.log(error);
}



