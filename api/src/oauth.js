var url = require('url');
var patreon = require('patreon');
const { default: Axios } = require('axios');
var patreonAPI = patreon.patreon;
var patreonOAuth = patreon.oauth;

// Use the client id and secret you received when setting up your OAuth account
var CLIENT_ID = 'J1LOaeORU64BNqNo1uZZHmDgSpEq8bjzEiCRSYFtaBCm4ac5sAEHGsRKV3H_BvIT';
var CLIENT_SECRET = 'UTPTbNXVuNor2WWd2kEC62blUzMo02WFC88Jd14Uv9fjHCTLO1zq63f5cGOb_1sw';
var patreonOAuthClient = patreonOAuth(CLIENT_ID, CLIENT_SECRET);

// This should be one of the fully qualified redirect_uri you used when setting up your oauth account
var redirectURL = 'https://happy-printer.co.uk/account';

module.exports.handleOAuthRedirectRequest = function (request, response) {
  var oauthGrantCode = url.parse(request.url, true).query.code;

  patreonOAuthClient
    .getTokens(oauthGrantCode, redirectURL)
    .then(function (tokensResponse) {
      var patreonAPIClient = patreonAPI(tokensResponse.access_token);
      return patreonAPIClient('/current_user');
    })
    .then(function (result) {
      var store = result.store;
      // store is a [JsonApiDataStore](https://github.com/beauby/jsonapi-datastore)
      // You can also ask for result.rawJson if you'd like to work with unparsed data
      const users = store.findAll('user');
      response.status(200).send(result.rawJson);
      // response.end(store.findAll("user").map((user) => user.serialize()));
    })
    .catch(function (err) {
      console.error('error!', err);
      response.end(err);
    });
};
