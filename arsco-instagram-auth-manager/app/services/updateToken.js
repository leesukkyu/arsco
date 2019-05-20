var Config = require('../../../arsco-common/config');
var logger = require('../../../arsco-common/logger');
var User = require('../../../arsco-common/db/models/User');
var httpRequest = require('request');
var AccessDB = require('../../../arsco-common/db/accessDB');

module.exports = function (options, res) {
    httpRequest(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var r = JSON.parse(body);
            var newUser = {
                id: r.user.id,
                username: r.user.username,
                full_name: r.user.full_name,
                bio: r.user.bio,
                website: r.user.website,
                profile_picture: r.user.profile_picture,
                access_token: r.access_token,
                code: options.form.code,
                update_date: new Date()
            };
            AccessDB.connect();
            User.findByIdAndUpdate(Config.$OID, newUser, function (err) {
                if (err) {
                    logger.info("유저 정보 업데이트 실패.");
                    if (res) {
                        res.json({ message: 'user update fail' });
                    }
                } else {
                    logger.info("유저 정보 업데이트.");
                    if (res) {
                        res.json({ message: 'user updated' });
                    }
                }
                AccessDB.close();
            });
        }
    });
}