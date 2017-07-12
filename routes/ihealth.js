import express from 'express';

const router = express.Router();

router.get('/user', function(req, res, next) {
  const BASE_IHEALTH_URL = 'https://api.ihealthlabs.com:8443/openapiv2/user';

  const url = BASE_IHEALTH_URL + '/' + req.query.userId + '/glucose.json/' +
    '?client_id=a0550986de68400d8c3707c911c93b95' +
    '&client_secret=dd6187e7fe85487abdb904535ee45365' +
    '&access_token=' + req.query.accessToken;

  request(url, function (error, response, body) {
    let data = JSON.parse(body);
    res.json(data);
  });
});

router.get('/callback', (req, res) => {
  if(req.query.code) {
    const code = req.query.code;
    const url = 'https://api.ihealthlabs.com:8443/OpenApiV2/OAuthv2/userauthorization/?client_id=a0550986de68400d8c3707c911c93b95&client_secret=dd6187e7fe85487abdb904535ee45365&grant_type=authorization_code&redirect_uri=https%3A%2F%2Fwelse-app.azurewebsites.net%2Fapi%2Fihealth%2Fcallback&code=' + code;
    request(url, function (error, response, body) {
      let data = JSON.parse(body);
      let access_token = data.AccessToken;
      let user_id = data.UserID;
      res.redirect('/#/ihealth/' + access_token + '/' + user_id);
    });
  }
});

module.exports = router;
