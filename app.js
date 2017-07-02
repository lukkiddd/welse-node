

var express = require('express'),
  config = require('./config/config'),
  bodyParser = require('body-parser'),
  firebase = require('firebase'),
  FitbitApiClient = require("fitbit-node"),
  fitbit_client = new FitbitApiClient("22862W", "b2c0662cae46bfbd023afea8634a5d26"),
  request = require('request');

var fireConfig = {
	apiKey: "AIzaSyBsXQ4ZjWB1C0dumOVK8tNZf8MlNcMauqc",
	authDomain: "welse-dashboard.firebaseapp.com",
	databaseURL: "https://welse-dashboard.firebaseio.com",
	projectId: "welse-dashboard",
	storageBucket: "welse-dashboard.appspot.com",
	messagingSenderId: "550064434282"
};
firebase.initializeApp(fireConfig);


var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// module.exports = require('./config/express')(app, config);


app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
  // client.open(connectCallback);
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.redirect('/index.html');
});

app.get('/api/ihealth/user', function(req, res) {
  var BASE_IHEALTH_URL = 'https://api.ihealthlabs.com:8443/openapiv2/user';

  var url = BASE_IHEALTH_URL + '/' + req.query.userId + '/glucose.json/' +
    '?client_id=a0550986de68400d8c3707c911c93b95' +
    '&client_secret=dd6187e7fe85487abdb904535ee45365' +
    '&access_token=' + req.query.accessToken;

  request(url, function (error, response, body) {
    var data = JSON.parse(body);
    res.json(data);
  })
  // console.log(req.query);
})

app.get('/api/ihealth/callback', function(req, res) {
  if(req.query.code) {
    var code = req.query.code;
    var url = 'https://api.ihealthlabs.com:8443/OpenApiV2/OAuthv2/userauthorization/?client_id=a0550986de68400d8c3707c911c93b95&client_secret=dd6187e7fe85487abdb904535ee45365&grant_type=authorization_code&redirect_uri=https%3A%2F%2Fwelse-app.azurewebsites.net%2Fapi%2Fihealth%2Fcallback&code=' + code;
    request(url, function (error, response, body) {
      var data = JSON.parse(body);
      var access_token = data.AccessToken;
      var user_id = data.UserID;
      res.redirect('/#/ihealth/' + access_token + '/' + user_id);
      // res.json(data);
    });
  }
  // res.json(req.params)
  // d = new Date();
  // d.setMonth(d.getMonth() - 1);
  // firebase.database().ref(`/health/STdHTA9CvIdJGtqjg0ZVYQCqK9t2/`)
  //   .push({
  //     chartType: 'line',
  //     isDanger: false,
  //     isLive: false,
  //     name: 'Blood glucose',
  //     timestatmp: d.getTime() / 1000,
  //     unit: 'mg/dl',
  //     value: 98,
  //   })
  // d.setMonth(d.getMonth() - 1);
  // firebase.database().ref(`/health/STdHTA9CvIdJGtqjg0ZVYQCqK9t2/`)
  //   .push({
  //     chartType: 'line',
  //     isDanger: true,
  //     isLive: false,
  //     name: 'Blood glucose',
  //     timestatmp: d.getTime() / 1000,
  //     unit: 'mg/dl',
  //     value: 123,
  //   })
  //   .then(function() {
  //     res.redirect('/#/dashboard/user');
  //   })
})

app.get('/api/fitbit/auth', function (req,res) {
  res.redirect(fitbit_client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'https://welse-app.azurewebsites.net/api/fitbit/callback'));
})

app.get('/api/fitbit/done', function (req,res) {
  console.log(req.body);
})

app.get('/api/fitbit/callback', function (req, res) {
  fitbit_client.getAccessToken(req.query.code, 'https://welse-app.azurewebsites.net/api/fitbit/done').then(function (result) {
    fitbit_client.get("/profile.json", result.access_token).then(function (results) {
      res.send(results[0]);
    });
  }).catch(function (error) {
    res.send(error);
  });
})