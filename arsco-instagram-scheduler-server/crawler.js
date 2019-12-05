const LOGGER = require('../arsco-common/logger');
const CONFIG = require('../arsco-common/config');

const httpRequest = require('request');
const fs = require('fs');
const shell = require('shelljs');

const accessDB = require('../arsco-common/db/accessDB');
const User = require('../arsco-common/db/models/User');
const Post = require('../arsco-common/db/models/Post');
const Deleted = require('../arsco-common/db/models/Deleted');

const updateToken = require('../arsco-instagram-auth-manager/app/services/updateToken');

//////////////////////////////////////////////////////////////
let FILE_FOLDER_PATH = __dirname + '/public';

//////////////////////////////////////////////////////////////

let start, getAccessToken, getPosts, savePosts, fileDownloadManager;
let instagramUserName, instagramUserCode;
let sendMsg;

accessDB.connect();

//////////////////////////////////////////////////////////////
// 실패시 문자 전송
sendMsg = function() {
  const options = {
    url: CONFIG.SMS.SEND_SMS_API,
    headers: {
      'X-NCP-auth-key': CONFIG.SMS.SMS_AUTH_KEY,
      'X-NCP-service-secret': CONFIG.SMS.SMS_SERVICE_SECRET,
      'content-type': 'application/json',
    },
    json: {
      type: 'sms',
      contentType: 'COMM',
      countryCode: '82',
      from: CONFIG.SMS.FROM_PHONE_NUMBER,
      to: CONFIG.SMS.TO_PHONE_NUMBER_LIST,
      content: CONFIG.SMS.MESSAGE,
    },
  };
  httpRequest.post(options, function(error, response, body) {
    if(body.status == 200){
      LOGGER.info('실패 문자 전송');
    }
  });
};
//////////////////////////////////////////////////////////////

// 1. 수집 시작.
start = function() {
  try {
    getAccessToken();
  } catch (error) {
    LOGGER.info('수집 에러');
  }
};

// 2. 우리 디비에서 엑세스 토큰을 가져온다.
getAccessToken = function() {
  User.findById(CONFIG.$OID, function(err, user) {
    if (err) {
      sendMsg();
      LOGGER.info('수집 에러 - 사용자 못찾음');
    } else {
      instagramUserName = user.username;
      instagramUserCode = user.code;
      getPosts(user.access_token);
    }
  });
};

// 3. 가져온 엑세스 토큰을 이용하여 포스트를 가져온다.
getPosts = function(access_token) {
  const requestOption = {
    url: CONFIG.GET_RECENT_POSTS_URL,
    method: 'GET',
    qs: {
      access_token: access_token,
      COUNT: 20,
    },
  };

  httpRequest(requestOption, function(error, response, body) {
    // 잘 가져온 경우
    if (!error && response.statusCode == 200) {
      var r = JSON.parse(body);
      var list = r.data;
      var postList = [];
      for (var i in list) {
        postList.push(list[i]);
      }
      savePosts(postList);
    }
    // 토큰이 만료된 경우
    else if (response.statusCode == 400) {
      var options = {
        url: CONFIG.instagram.get_access_token_url,
        method: 'POST',
        form: {
          client_id: CONFIG.instagram.client_id,
          client_secret: CONFIG.instagram.client_secret,
          grant_type: CONFIG.instagram.grant_type,
          redirect_uri: CONFIG.instagram.redirect_uri,
          code: instagramUserCode,
        },
      };
      LOGGER.info('토큰 만료 => 토큰 자동 업데이트 시도');
      sendMsg();
      updateToken(options);
    }
    // 기타 에러
    else {
      LOGGER.info('포스트 조회 에러 : ' + response.body);
    }
  });
};

savePosts = function(postList) {
  Deleted.find({}, function(err, deletedList) {
    let deletedIdList = [];
    let newPostList = [];
    if (!err) {
      deletedList.forEach((item, index) => {
        deletedIdList[index] = item.id;
      });
      postList.forEach(item => {
        if (deletedIdList.indexOf(item.id) == -1) {
          newPostList.push(item);
        }
      });
      Post.create(newPostList, function(error, res) {
        if (res && res.length > 0) {
          LOGGER.info(res.length + '개 수집 성공.');
          for (var i in res) {
            fileDownloadManager(res[i]);
          }
        } else {
          LOGGER.info('이미 전부 수집했음');
        }
      });
    }
  });
};

// 5. 우리 저장소에 이미지를 저장한다.
fileDownloadManager = (function() {
  let downLoadImage, downLoadVideo;

  const getFileName = uri =>
    uri.slice(uri.lastIndexOf('/') + 1, uri.lastIndexOf('?'));

  const download = function(uri, filename, callback) {
    if (!fs.existsSync(filename)) {
      httpRequest.head(uri, function() {
        httpRequest(uri)
          .pipe(fs.createWriteStream(filename))
          .on('close', callback);
      });
    } else {
      LOGGER.info('중복되는 파일이 있어, 다운로드 실패');
    }
  };

  // 다운로드 할 폴더가 존재하는지 확인
  const checkExistDirectory = (function() {
    const checkDirectory = function(directory) {
      if (!fs.existsSync(directory)) {
        shell.mkdir('-p', directory);
      }
    };
    return function() {
      checkDirectory(
        FILE_FOLDER_PATH +
          '/' +
          instagramUserName +
          '/images/standard_resolution',
      );
      checkDirectory(
        FILE_FOLDER_PATH + '/' + instagramUserName + '/images/low_resolution',
      );
      checkDirectory(
        FILE_FOLDER_PATH + '/' + instagramUserName + '/images/thumbnail',
      );
      checkDirectory(
        FILE_FOLDER_PATH +
          '/' +
          instagramUserName +
          '/videos/standard_resolution',
      );
      checkDirectory(
        FILE_FOLDER_PATH + '/' + instagramUserName + '/videos/low_resolution',
      );
    };
  })();

  downLoadImage = function(post) {
    let fileUrl = post.images.standard_resolution.url;
    download(
      fileUrl,
      FILE_FOLDER_PATH +
        '/' +
        instagramUserName +
        '/images/standard_resolution/' +
        getFileName(fileUrl),
      function() {
        LOGGER.info('이미지 다운로드 완료');
      },
    );
    fileUrl = post.images.low_resolution.url;
    download(
      fileUrl,
      FILE_FOLDER_PATH +
        '/' +
        instagramUserName +
        '/images/low_resolution/' +
        getFileName(fileUrl),
      function() {
        LOGGER.info('이미지 다운로드 완료');
      },
    );
    fileUrl = post.images.thumbnail.url;
    download(
      fileUrl,
      FILE_FOLDER_PATH +
        '/' +
        instagramUserName +
        '/images/thumbnail/' +
        getFileName(fileUrl),
      function() {
        LOGGER.info('이미지 다운로드 완료');
      },
    );
  };

  downLoadVideo = function(post) {
    let fileUrl;
    // 비디오 포스팅인데 비디오 정보가 없는 경우가 있음. 그런 경우는 이미지로 취급.
    if (post.videos) {
      fileUrl = post.videos.standard_resolution.url;
      download(
        fileUrl,
        FILE_FOLDER_PATH +
          '/' +
          instagramUserName +
          '/videos/standard_resolution/' +
          getFileName(fileUrl),
        function() {
          LOGGER.info('비디오 다운로드 완료');
        },
      );
      fileUrl = post.videos.low_resolution.url;
      download(
        fileUrl,
        FILE_FOLDER_PATH +
          '/' +
          instagramUserName +
          '/videos/low_resolution/' +
          getFileName(fileUrl),
        function() {
          LOGGER.info('비디오 다운로드 완료');
        },
      );
    } else {
      downLoadImage(post);
    }
  };

  return function(post) {
    var type, mediaList;

    // 폴더 존재 체크
    checkExistDirectory();

    type = post.type;

    // 복합 게시물 형태
    if (type == 'carousel') {
      mediaList = post.carousel_media;
      for (var i in mediaList) {
        if (mediaList[i].type == 'image') {
          downLoadImage(mediaList[i]);
        } else if (mediaList[i].type == 'video') {
          downLoadVideo(mediaList[i]);
        }
      }
    }

    // 이미지 게시물 형태
    else if (type == 'image') {
      downLoadImage(post);
    }

    // 비디오 게시물 형태
    else if (type == 'video') {
      downLoadVideo(post);
    }

    // 기타 게시물 형태
    else {
      LOGGER.info('새로운 게시물 형태 발견');
    }
  };
})();

exports.start = start;
