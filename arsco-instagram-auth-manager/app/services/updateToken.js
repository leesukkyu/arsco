require('module-alias/register');

const CONFIG = require('@Common/config');
const LOGGER = require('@Common/logger');

const accessDB = require('@Common/db/accessDB');

const User = require('@Common/db/models/User');

const httpRequest = require('request');

module.exports = function(options, res) {
  httpRequest(options, function(error, response, body) {
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
        update_date: new Date(),
      };
      accessDB.connect();
      User.findByIdAndUpdate(CONFIG.$OID, newUser, function(err) {
        if (err) {
          LOGGER.info('유저 정보 업데이트 실패.');
          if (res) {
            res.json({ message: '인스타그램 유저 정보 업데이트 실패' });
          }
        } else {
          LOGGER.info('유저 정보 업데이트.');
          if (res) {
            res.json({ message: '인스타그램 유저 정보 업데이트 성공' });
          }
        }
        accessDB.close();
      });
    }
  });
};
