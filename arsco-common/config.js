var in_client_id = '5c4a55171ed54b6bb05e09b14d29aca6',
	in_client_secret = 'ff6fe1f3b5044c2297b5c4d7189d6c86',
	in_redirect_uri = 'http://ec2-18-220-151-89.us-east-2.compute.amazonaws.com:3000/auth',
	in_auth_url = 'https://api.instagram.com/oauth/authorize/?client_id=' + in_client_id + '&redirect_uri=' + in_redirect_uri + '&response_type=code';


var in_get_access_token_url = 'https://api.instagram.com/oauth/access_token';

var DB_USER = 'leesukkyu';
var PASSWORD = 'tjrrnddl1!';

var db_uri = 'mongodb://'+ DB_USER +':'+ PASSWORD +'@ds145752.mlab.com:45752/with3121';
var $OID = '5b9023436c9c8a0374398201';

var GET_RECENT_POSTS_URL = 'https://api.instagram.com/v1/users/self/media/recent/'

module.exports = {
	port: process.env.PORT || 3000,
	db: {
		uri: db_uri
	},
	instagram: {
		client_id: in_client_id,
		client_secret: in_client_secret,
		grant_type : 'authorization_code',
		redirect_uri: in_redirect_uri,
		auth_url: in_auth_url,
		get_access_token_url : in_get_access_token_url
	},
	$OID : $OID,
	GET_RECENT_POSTS_URL : GET_RECENT_POSTS_URL
};