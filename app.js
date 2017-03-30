

var express = require('express'),
  config = require('./config/config'),
  clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString,
  Message = require('azure-iot-device').Message;

var app = express();

module.exports = require('./config/express')(app, config);

var connectionString = 'HostName=welse-hub.azure-devices.net;DeviceId=myFirstNodeDevice;SharedAccessKey=cD5l87zRC5+JV0JDQ4znJqqOqZiCuBKiFb6nWEdx0bU=';
var client = clientFromConnectionString(connectionString);

function printResultFor(op) {
   return function printResult(err, res) {
     if (err) console.log(op + ' error: ' + err.toString());
     if (res) console.log(op + ' status: ' + res.constructor.name);
   };
 }


var connectCallback = function (err) {
   if (err) {
     console.log('Could not connect: ' + err);
   } else {
     console.log('Client connected');
 };


app.get('/update', function(req, res) {
  var windSpeed = 10 + (Math.random() * 4);
  var data = JSON.stringify({ deviceId: 'myFirstNodeDevice', windSpeed: windSpeed });
  var message = new Message(data);
  console.log("Sending message: " + message.getData());
  client.sendEvent(message, printResultFor('send'));
  return res.send(message);
})

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
  client.open(connectCallback);
});

