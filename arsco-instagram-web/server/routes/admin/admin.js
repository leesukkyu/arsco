require('module-alias/register');
const CONFIG = require('@Common/arsco-common/config');
const express = require('express');
const router = express.Router();

/* GET admin home page. */
router.get('/', function(req, res, next) {
  res.render('admin/index.html');
});

// 로그인 로직
router.post('/login', function(req, res, next) {
  var username, password;
  var session;

  DB_USERNAME = 'arsco';
  DB_PASSWORD = 'arsco12346';

  username = req.body.username;
  password = req.body.password;

  if (
    CONFIG.ADMIN.ADMIN_ID == username &&
    CONFIG.ADMIN.ADMIN_PASSWORD == password
  ) {
    session = req.session;
    session.username = username;
    res.json({
      err: 0,
      redirect: '/admin/main',
    });
  } else {
    res.json({
      err: 1,
    });
  }
});

// 로그아웃
router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    if (err) {
      res.json({
        err: 1,
      });
    } else {
      res.json({
        err: 0,
        redirect: '/admin',
      });
    }
  });
});

// 로그인 완료 페이지
router.get('/main', function(req, res, next) {
  // 세션 체크 후 성공하면 main.html 랜더.
  if (req.session.username) {
    res.render('admin/main.html');
  } else {
    res.redirect('/admin');
  }
});

module.exports = router;
