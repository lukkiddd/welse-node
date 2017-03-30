

var express = require('express'),
  config = require('./config/config'),
  clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString,
  Message = require('azure-iot-device').Message;

var app = express();

module.exports = require('./config/express')(app, config);

var connectionString = 'HostName=welse-hub.azure-devices.net;DeviceId=myFirstNodeDevice;SharedAccessKey=cD5l87zRC5+JV0JDQ4znJqqOqZiCuBKiFb6nWEdx0bU=';
var client = clientFromConnectionString(connectionString);

var connectCallback = function (err) {
   if (err) {
     console.log('Could not connect: ' + err);
   } else {
     console.log('Client connected');
   }
 };
 
app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
  client.open(connectCallback);
});

