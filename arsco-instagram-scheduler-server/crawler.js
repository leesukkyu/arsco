const HttpRequest = require('request');
const Fs = require('fs');
const Shell = require('shelljs');

const logger = require('../arsco-common/logger');
const Config = require('../arsco-common/config');

const AccessDB = require('../arsco-common/db/accessDB');
const User = require('../arsco-common/db/models/User');
const Post = require('../arsco-common/db/models/Post');
const Deleted = require('../arsco-common/db/models/Deleted');

var updateToken = require('../arsco-instagram-auth-manager/app/services/updateToken');

//////////////////////////////////////////////////////////////
let FILE_FOLDER_PATH = __dirname + '/public';


var instagram_user_name;
var instagram_user_code;
//////////////////////////////////////////////////////////////

var start, getAccessToken, getPosts, savePosts, fileDownloadManager;
var sendMsg;

AccessDB.connect();

//////////////////////////////////////////////////////////////
// 실패시 문자 전송
sendMsg = function () {
	var options = {
		url: 'https://api-sens.ncloud.com/v1/sms/services/ncp:sms:kr:254889181571:arsco_instagram/messages',
		headers: {
			'X-NCP-auth-key': 'JsSMI1pqn5oMKHdpXMsM',
			'X-NCP-service-secret': 'ad0a6a0338434b51ad57b11fb79de8ee',
			'content-type': 'application/json'
		},
		json: {
			"type": "sms",
			"contentType": "COMM",
			"countryCode": "82",
			"from": "01027842146",
			"to": [
				"01072285897",
				"01027842146"
			],
			"content": "http://ec2-18-220-151-89.us-east-2.compute.amazonaws.com:3000"
		}
	};
	HttpRequest.post(options, function (error, response, body) {
		console.log(error, response, body);
		logger.info('문자 알림 전송');
	})
}
//////////////////////////////////////////////////////////////

// 1. 수집 시작.
start = function () {
	try {
		getAccessToken();
	} catch (error) {
		logger.info('수집 에러');
	}
}

// 2. 우리 디비에서 엑세스 토큰을 가져온다.
getAccessToken = function () {
	User.findById(Config.$OID, function (err, user) {
		if (err) {
			sendMsg();
			logger.info('수집 에러 - 사용자 못찾음');
		} else {
			instagram_user_name = user.username;
			instagram_user_code = user.code;
			getPosts(user.access_token);
		}
	})
}

// 3. 가져온 엑세스 토큰을 이용하여 포스트를 가져온다.
getPosts = function (access_token) {
	var RequestOption;

	RequestOption = {
		url: Config.GET_RECENT_POSTS_URL,
		method: 'GET',
		qs: {
			access_token: access_token,
			COUNT: 20
		}
	};

	HttpRequest(RequestOption, function (error, response, body) {
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
				url: Config.instagram.get_access_token_url,
				method: 'POST',
				form: {
					client_id: Config.instagram.client_id,
					client_secret: Config.instagram.client_secret,
					grant_type: Config.instagram.grant_type,
					redirect_uri: Config.instagram.redirect_uri,
					code: instagram_user_code
				}
			};
			logger.info('토큰 만료 => 토큰 자동 업데이트 시도');
			sendMsg();
			updateToken(options);
		}
		// 기타 에러
		else {
			logger.info('포스트 조회 에러 : ' + response.body);
		}
	});
}

// 4. 가져온 포스트를 저장한다.
// savePosts = function (postList) {
// 	if (postList.length) {
// 		for(var i in postList){
// 			Deleted.find({id : postList[i].id}, function(err, res){
// 				console.log(err, res);
// 				if(res.length){
// 					// 삭제된 경력이 있음
// 					console.log('삭제된 경력이 있음');
// 				}else{
// 					// 삭제된 경력이 없음
// 					console.log('삭제된 경력이 없음');

// 					if(postList[i].caption){
// 						console.log(postList[i].caption);
// 					}else{
// 						console.log(postList[i].caption.text);
// 					}

// 					Post.create(postList[i], function (error, res) {
// 						if (!error) {
// 							logger.info(res.length + '개 수집 성공.');
// 							for (var i in res) {
// 								fileDownloadManager(res[i]);
// 							}
// 						} else {
// 							logger.info('이미 전부 수집했음');
// 						}
// 					})
// 				}
// 			})
// 		}
// 	}
// }
savePosts = function (postList) {
	Deleted.find({}, function (err, deletedList) {
		var deletedIdList = [];
		var newPostList = [];
		if (!err) {
			console.log(deletedList);
			for (var i in deletedList) {
				deletedIdList[i] = deletedList[i].id
			}
			for (var i in postList) {
				if (deletedIdList.indexOf(postList[i].id) == -1) {
					newPostList.push(postList[i]);
				}
			}
			Post.create(newPostList, function (error, res) {
				if (res.length > 0) {
					logger.info(res.length + '개 수집 성공.');
					for (var i in res) {
						fileDownloadManager(res[i]);
					}
				} else {
					logger.info('이미 전부 수집했음');
				}
			})
		}
	})
}

// 5. 우리 저장소에 이미지를 저장한다.
fileDownloadManager = (function () {

	var getFileName, download, checkExistDirectory;

	var downLoadImage, downLoadVideo;

	getFileName = (uri) => uri.slice(uri.lastIndexOf('/') + 1, uri.lastIndexOf('?'));

	download = function (uri, filename, callback) {
		if (!Fs.existsSync(filename)) {
			HttpRequest.head(uri, function (err, res, body) {
				HttpRequest(uri).pipe(Fs.createWriteStream(filename)).on('close', callback);
			});
		} else {
			logger.info('중복되는 파일이 있어, 다운로드 실패');
		}
	};

	// 다운로드 할 폴더가 존재하는지 확인
	checkExistDirectory = (function () {
		var checkDirectory;
		checkDirectory = function (directory, callback) {
			if (!Fs.existsSync(directory)) {
				Shell.mkdir('-p', directory)
			}
		}
		return function () {
			checkDirectory(FILE_FOLDER_PATH + '/' + instagram_user_name + '/images/standard_resolution', (err) => {
				console.log(err)
			});
			checkDirectory(FILE_FOLDER_PATH + '/' + instagram_user_name + '/images/low_resolution', (err) => {
				console.log(err)
			});
			checkDirectory(FILE_FOLDER_PATH + '/' + instagram_user_name + '/images/thumbnail', (err) => {
				console.log(err)
			});
			checkDirectory(FILE_FOLDER_PATH + '/' + instagram_user_name + '/videos/standard_resolution', (err) => {
				console.log(err)
			});
			checkDirectory(FILE_FOLDER_PATH + '/' + instagram_user_name + '/videos/low_resolution', (err) => {
				console.log(err)
			});
		}
	})()

	downLoadImage = function (post) {
		var fileUrl;
		fileUrl = post.images.standard_resolution.url;
		download(fileUrl, FILE_FOLDER_PATH + '/' + instagram_user_name + '/images/standard_resolution/' + getFileName(fileUrl), function () {
			console.log('image done');
		});
		fileUrl = post.images.low_resolution.url;
		download(fileUrl, FILE_FOLDER_PATH + '/' + instagram_user_name + '/images/low_resolution/' + getFileName(fileUrl), function () {
			console.log('image done');
		});
		fileUrl = post.images.thumbnail.url;
		download(fileUrl, FILE_FOLDER_PATH + '/' + instagram_user_name + '/images/thumbnail/' + getFileName(fileUrl), function () {
			console.log('image done');
		});
	}

	downLoadVideo = function (post) {
		var fileUrl;
		// 비디오 포스팅인데 비디오 정보가 없는 경우가 있음. 그런 경우는 이미지로 취급.
		if (post.videos) {
			fileUrl = post.videos.standard_resolution.url;
			download(fileUrl, FILE_FOLDER_PATH + '/' + instagram_user_name + '/videos/standard_resolution/' + getFileName(fileUrl), function () {
				console.log('video done');
			});
			fileUrl = post.videos.low_resolution.url;
			download(fileUrl, FILE_FOLDER_PATH + '/' + instagram_user_name + '/videos/low_resolution/' + getFileName(fileUrl), function () {
				console.log('video done');
			});
		} else {
			downLoadImage(post)
		}
	}

	return function (post) {
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

		}
	}
})();

exports.start = start;