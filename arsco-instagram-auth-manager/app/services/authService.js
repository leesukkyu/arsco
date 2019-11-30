const CONFIG = require('../../../arsco-common/config');

const updateToken = require('./updateToken');

module.exports = function(req, res) {
  var options = {
    url: CONFIG.instagram.get_access_token_url,
    method: 'POST',
    form: {
      client_id: CONFIG.instagram.client_id,
      client_secret: CONFIG.instagram.client_secret,
      grant_type: CONFIG.instagram.grant_type,
      redirect_uri: CONFIG.instagram.redirect_uri,
      code: req.query.code,
    },
  };
  updateToken(options, res);
};
