

var express = require('express'),
  config = require('./config/config'),
  bodyParser = require('body-parser'),
  firebase = require('firebase');

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
// http://sandboxapi.ihealthlabs.com/OpenApiV2/OAuthv2/userauthorization/?client_id=620360bb5c0c46019527d34a6b6c49bd&response_type=code&redirect_uri=http%3A%2F%2Fwelseapps.azurewebsites.net%2Fihealth%2Fcallback&APIName=OpenApiActivity%20OpenApiBG%20OpenApiBP%20OpenApiSleep
app.get('/', function(req, res){
  res.redirect('/index.html');
});

app.get('/api/ihealth/callback', function(req, res) {
  console.log(req);
  res.json(req);
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