var Config = require('../../../arsco-common/config');
var updateToken = require('./updateToken');
module.exports = function (req, res) {
	var options = {
		url: Config.instagram.get_access_token_url, 
		method: 'POST',
		form: {
			client_id: Config.instagram.client_id,
			client_secret: Config.instagram.client_secret,
			grant_type: Config.instagram.grant_type,
			redirect_uri: Config.instagram.redirect_uri,
			code: req.query.code
		}
	};
	updateToken(options, res);
};