require('module-alias/register');
const express = require('express');
const router = express.Router();

const Post = require('@Common/db/models/Post');
const Config = require('@Common/db/models/Config');
const Deleted = require('@Common/db/models/Deleted');

function checkLogin(req, res) {
  if (req.session && req.session.username) {
    return true;
  } else {
    res.status(401).send('auth error');
    return false;
  }
}

/* GET home page. */
router.get('/getAllPost.json', function (req, res, next) {
  Post.find()
    .sort({
      created_time: -1,
    })
    .exec(function (err, posts) {
      res.json(posts);
    });
});

// 커스텀 태그 트리 데이터를 저장한다.
router.post('/saveTagTree.json', function (req, res, next) {
  if (checkLogin(req, res)) {
    var newTree;
    newTree = req.body.tree;
    Config.findOneAndUpdate({}, { $set: { tree: newTree } }, function (
      err,
      tree,
    ) {
      if (err) {
        res.json({
          err: err,
          tree: newTree,
        });
      } else {
        res.json({
          succ: newTree,
        });
      }
    });
  }
});

// 로드할 서버 정보 데이터를 저장한다.
router.post('/saveLoadServerSetting.json', function (req, res, next) {
  if (checkLogin(req, res)) {
    var loadServer;
    loadServer = req.body.loadServer;
    Config.findOneAndUpdate({}, { $set: { loadServer: loadServer } }, function (
      err,
      tree,
    ) {
      if (err) {
        res.json({
          err: err,
          loadServer: loadServer,
        });
      } else {
        res.json({
          succ: loadServer,
        });
      }
    });
  }
});

// 설정 정보를 모두 로드한다.
router.get('/loadConfig.json', function (req, res, next) {
  Config.findOne(function (err, rs) {
    if (err) {
      res.json({
        err: err,
      });
    } else {
      res.json(rs);
    }
  });
});

// 포스트를 지운다.
router.post('/deletePost.json', function (req, res, next) {
  if (checkLogin(req, res)) {
    var idList = [];
    idList = req.body.idList;
    Post.find({ _id: { $in: idList } }, function (err, postList) {
      if (err) {
        res.json({
          err: err,
        });
      } else {
        postList.forEach(function (post) {
          post.remove();
          Deleted.create({ id: post.id }, function (err) {
            //console.log(err);
          });
        });
        res.json({
          err: 0,
        });
      }
    });
  }
});

module.exports = router;
