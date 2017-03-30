var express = require('express'),
  router = express.Router(),
  clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString,
  Message = require('azure-iot-device').Message;

module.exports = function (app) {
  app.use('/', router);
};

var connectionString = 'HostName=welse-hub.azure-devices.net;DeviceId=myFirstNodeDevice;SharedAccessKey=cD5l87zRC5+JV0JDQ4znJqqOqZiCuBKiFb6nWEdx0bU=';
var client = clientFromConnectionString(connectionString);

function printResultFor(op) {
   return function printResult(err, res) {
     if (err) console.log(op + ' error: ' + err.toString());
     if (res) console.log(op + ' status: ' + res.constructor.name);
   };
 }


router.get('/device', function(req, res) {
  var windSpeed = 10 + (Math.random() * 4);
  var data = JSON.stringify({ deviceId: 'myFirstNodeDevice', windSpeed: windSpeed });
  var message = new Message(data);
  console.log("Sending message: " + message.getData());
  client.sendEvent(message, printResultFor('send'));
  return res.send(message);
})

