var express = require('express'),
  router = express.Router(),
  clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString,
  Message = require('azure-iot-device').Message;


module.exports = function (app) {
  app.use('/api', router);
};

var connectionString = 'HostName=welse-hub.azure-devices.net;DeviceId=myFirstNodeDevice;SharedAccessKey=cD5l87zRC5+JV0JDQ4znJqqOqZiCuBKiFb6nWEdx0bU=';
var client = clientFromConnectionString(connectionString);

function printResultFor(op) {
   return function printResult(err, res) {
     if (err) console.log(op + ' error: ' + err.toString());
     if (res) console.log(op + ' status: ' + res.constructor.name);
   };
 }



router.route('/device')
    .post(function(req, res) {
        console.log('post');
        var data = JSON.stringify( req.body );
        var message = new Message(data);
        client.sendEvent(message, printResultFor('send'));
        return res.json(req.body);
    })
    .get(function(req,res) {
        console.log('get');
        return res.json({'data': 'data'})
    })

