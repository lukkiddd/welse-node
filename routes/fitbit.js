import express from 'express';
import FitbitApiClient from 'fitbit-node';

const CLIENT_ID = "22862W";
const CLIENT_TOKEN = "b2c0662cae46bfbd023afea8634a5d26";

const router = express.Router();
const fitbit_client = new FitbitApiClient(CLIENT_ID, CLIENT_TOKEN);

router.get('/auth', (req, res, next) => {
  res.redirect(fitbit_client.getAuthorizeUrl('activity sleep', 'https://welse-app.azurewebsites.net/api/fitbit/callback'));
});

router.get('/callback', (req, res) => {
  fitbit_client.getAccessToken(req.query.code, 'https://welse-app.azurewebsites.net/api/fitbit/callback').then( (result) => {
    fitbit_client.get("/activities/steps/date/today/1y.json", result.access_token).then( (results) => {
      fitbit_client.get('/sleep/date/today/1y.json', result.access_token).then( (res) => {
        console.log(results);
        console.log(res);
        var data = JSON.stringify(results[0]);
        res.redirect('/#/fitbit/' + data);
      })
    });
  }).catch(function (error) {
    res.send(error);
  });
})

module.exports = router;
